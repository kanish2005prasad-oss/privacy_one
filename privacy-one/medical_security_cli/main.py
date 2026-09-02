import sys
import os

# Ensure modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from clinical.clinical_safety import initialize_vector_store, evaluate_medication_safety
from fraud.fraud_detection import train_isolation_forest, evaluate_transaction
from utils.formatting import print_clinical_result, print_fraud_result

def test_case_a(collection):
    patient = {
        "condition": "Hypertension",
        "current_medications": ["Lisinopril 20mg"],
        "allergies": []
    }
    new_med = "Ibuprofen 800mg"
    
    patient_info = f"Patient Condition : {patient['condition']}\n"
    patient_info += f"Current Medication: {', '.join(patient['current_medications'])}\n"
    patient_info += f"New Prescription  : {new_med}"
    
    result = evaluate_medication_safety(patient, new_med, collection)
    print_clinical_result(result, "TEST CASE A — SEVERE INTERACTION", patient_info)

def test_case_b(collection):
    patient = {
        "condition": "Mild asthma",
        "current_medications": ["Albuterol inhaler"],
        "allergies": ["Penicillin"]
    }
    new_med = "Azithromycin 250mg"
    
    patient_info = f"Patient Condition : {patient['condition']}\n"
    patient_info += f"Current Medication: {', '.join(patient['current_medications'])}\n"
    patient_info += f"New Prescription  : {new_med}"
    
    result = evaluate_medication_safety(patient, new_med, collection)
    print_clinical_result(result, "TEST CASE B — SAFE BASELINE", patient_info)

def test_case_c(model):
    transaction = {
        "prescription_location": "Chennai",
        "dispensing_location": "Chennai",
        "prescription_timestamp": "10:00",
        "dispensing_timestamp": "14:30",
        "dosage_volume": 30,
        "duplicate_claim": 0
    }
    
    info = f"Prescription Location : {transaction['prescription_location']}\n"
    info += f"Dispensing Location   : {transaction['dispensing_location']}\n"
    info += f"Prescription Time     : {transaction['prescription_timestamp']}\n"
    info += f"Dispensing Time       : {transaction['dispensing_timestamp']}\n"
    info += f"Dosage Volume         : {transaction['dosage_volume']}\n"
    info += f"Duplicate Claim       : {transaction['duplicate_claim']}"
    
    result = evaluate_transaction(transaction, model)
    print_fraud_result(result, "TEST CASE C — NORMAL TRANSACTION", info)

def test_case_d(model):
    transaction = {
        "prescription_location": "Chennai",
        "dispensing_location": "Delhi",
        "prescription_timestamp": "10:00",
        "dispensing_timestamp": "11:15",
        "dosage_volume": 180,
        "duplicate_claim": 1
    }
    
    info = f"Prescription Location : {transaction['prescription_location']}\n"
    info += f"Dispensing Location   : {transaction['dispensing_location']}\n"
    info += f"Prescription Time     : {transaction['prescription_timestamp']}\n"
    info += f"Dispensing Time       : {transaction['dispensing_timestamp']}\n"
    info += f"Dosage Volume         : {transaction['dosage_volume']}\n"
    info += f"Duplicate Claim       : {transaction['duplicate_claim']}"
    
    result = evaluate_transaction(transaction, model)
    print_fraud_result(result, "TEST CASE D — GEOGRAPHIC & VOLUME ANOMALY", info)

def print_menu():
    print("=" * 60)
    print("        MEDICAL SECURITY AI — CLI PROTOTYPE")
    print("=" * 60)
    print("1. Run Clinical Safety Tests")
    print("2. Run Pharmacy Fraud Tests")
    print("3. Run All Demo Tests")
    print("4. Exit")
    print("=" * 60)
    print("DISCLAIMER:")
    print("This prototype uses mock pharmacological reference data and an")
    print("AI model for demonstration purposes only. It is not medical")
    print("advice and must not be used to make real clinical or dispensing")
    print("decisions. Medication decisions require review by a qualified")
    print("healthcare professional.")
    print("=" * 60)

def main():
    print("Initializing components, please wait...")
    try:
        collection = initialize_vector_store()
        fraud_model = train_isolation_forest()
    except Exception as e:
        print(f"Failed to initialize components: {e}")
        return

    while True:
        print_menu()
        try:
            choice = input("Select an option: ").strip()
        except EOFError:
            break
        
        if choice == '1':
            test_case_a(collection)
            test_case_b(collection)
        elif choice == '2':
            test_case_c(fraud_model)
            test_case_d(fraud_model)
        elif choice == '3':
            test_case_a(collection)
            test_case_b(collection)
            test_case_c(fraud_model)
            test_case_d(fraud_model)
        elif choice == '4' or not choice:
            print("Exiting...")
            break
        else:
            print("Invalid option. Please choose 1, 2, 3, or 4.")

if __name__ == "__main__":
    main()
