import math
import random
from datetime import datetime
from sklearn.ensemble import IsolationForest
from data.mock_drug_data import CITY_COORDINATES

def haversine(coord1, coord2):
    R = 6371.0 # Earth radius in kilometers
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance

def calculate_time_diff_minutes(time1_str, time2_str):
    t1 = datetime.strptime(time1_str, "%H:%M")
    t2 = datetime.strptime(time2_str, "%H:%M")
    diff = t2 - t1
    return int(diff.total_seconds() / 60)

def extract_features(transaction):
    loc1 = transaction.get("prescription_location")
    loc2 = transaction.get("dispensing_location")
    
    coord1 = CITY_COORDINATES.get(loc1, (0,0))
    coord2 = CITY_COORDINATES.get(loc2, (0,0))
    
    dist_km = haversine(coord1, coord2)
    time_diff = calculate_time_diff_minutes(
        transaction.get("prescription_timestamp", "00:00"),
        transaction.get("dispensing_timestamp", "00:00")
    )
    
    return [
        float(transaction.get("dosage_volume", 0)),
        float(time_diff),
        float(dist_km),
        float(transaction.get("duplicate_claim", 0))
    ]

def generate_normal_data(num_samples=200):
    random.seed(42)
    X = []
    for _ in range(num_samples):
        vol = random.uniform(20, 60)
        time_diff = random.uniform(60, 1440)
        dist = 0.0 if random.random() < 0.8 else random.uniform(1, 30)
        dup = 0
        X.append([vol, time_diff, dist, dup])
    return X

def train_isolation_forest():
    X_train = generate_normal_data()
    model = IsolationForest(
        n_estimators=200,
        contamination=0.05,
        random_state=42
    )
    model.fit(X_train)
    return model

def generate_fraud_reason(features_dict):
    reasons = []
    dist = features_dict["geographic_distance_km"]
    time_diff = features_dict["time_difference_minutes"]
    vol = features_dict["dosage_volume"]
    dup = features_dict["duplicate_claim"]
    
    # speed > 100 km/h implies anomaly in physical travel
    if dist > 50 and time_diff < (dist / 100 * 60):
        reasons.append("Geographical mismatch between prescription and dispensing locations within short timeframe")
    
    if vol > 100:
        reasons.append("unusually high dosage volume")
        
    if dup == 1:
        reasons.append("duplicate claim detected")
        
    if not reasons:
        return "Normal transaction pattern."
    else:
        return "Flagged: " + "; ".join(reasons) + "."

def evaluate_transaction(transaction: dict, model) -> dict:
    feature_vector = extract_features(transaction)
    
    prediction = model.predict([feature_vector])[0]
    score = model.decision_function([feature_vector])[0]
    
    features_dict = {
        "dosage_volume": feature_vector[0],
        "time_difference_minutes": feature_vector[1],
        "geographic_distance_km": feature_vector[2],
        "duplicate_claim": feature_vector[3]
    }
    
    reason = generate_fraud_reason(features_dict)
    
    # Hybrid rule: if isolation forest didn't catch it but rules did
    rule_based_fraud = reason != "Normal transaction pattern."
    
    fraud_flag = bool(prediction == -1) or rule_based_fraud
    
    return {
        "fraud_flag": fraud_flag,
        "anomaly_score": float(score),
        "reason": reason,
        "features": features_dict
    }
