from flask import Flask, request, jsonify
import sys
import os

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'medical_security_cli'))

from clinical.clinical_safety import initialize_vector_store, evaluate_medication_safety
from fraud.fraud_detection import train_isolation_forest, evaluate_transaction

app = Flask(__name__)

print("Initializing ChromaDB...")
collection = initialize_vector_store()
print("Training Isolation Forest...")
fraud_model = train_isolation_forest()
print("Models ready.")

@app.route('/api/clinical-safety', methods=['POST'])
def clinical_safety():
    data = request.json
    patient_profile = data.get('patient_profile')
    new_medication = data.get('new_medication')
    
    if not patient_profile or not new_medication:
        return jsonify({"error": "Missing patient_profile or new_medication"}), 400
        
    result = evaluate_medication_safety(patient_profile, new_medication, collection)
    return jsonify(result)

@app.route('/api/fraud-detection', methods=['POST'])
def fraud_detection():
    transaction = request.json
    if not transaction:
        return jsonify({"error": "Missing transaction data"}), 400
        
    result = evaluate_transaction(transaction, fraud_model)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=False)
