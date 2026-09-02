import json

def format_json(result: dict) -> str:
    """Formats a dictionary as a JSON string handling basic serialization issues."""
    return json.dumps(result, indent=4)

def print_clinical_result(result: dict, test_name: str, patient_info: str):
    print("=" * 60)
    print("CLINICAL INTELLIGENCE & SAFETY CHECK")
    print("=" * 60)
    print(f"\n{test_name}")
    print("-" * 60)
    print(patient_info)
    
    print("\nRESULT")
    print("-" * 60)
    print(f"Risk Score       : {result.get('risk_score')}/100")
    print(f"Severity         : {result.get('severity')}")
    print(f"LLM Status       : {result.get('llm_status', 'Available')}")
    
    print("\nInteractions:")
    for interaction in result.get('interactions', []):
        print(f"  - {interaction.get('drug')}: {interaction.get('issue')}")
        
    print("\nClinical Explanation:")
    print(f"  {result.get('explanation')}")
    
    print("\nRetrieved Evidence:")
    for i, ref in enumerate(result.get('retrieved_references', []), 1):
        print(f"  {i}. {ref}")
    print("-" * 60)

def print_fraud_result(result: dict, test_name: str, transaction_info: str):
    print("=" * 60)
    print("PHARMACY DISPENSING & FRAUD DETECTION")
    print("=" * 60)
    print(f"\n{test_name}")
    print("-" * 60)
    print(transaction_info)
    
    print("\nRESULT")
    print("-" * 60)
    print(f"Fraud Flag            : {result.get('fraud_flag')}")
    print(f"Anomaly Score         : {result.get('anomaly_score'):.2f}")
    
    features = result.get('features', {})
    print("\nFeatures:")
    print(f"  Geographic Distance : {features.get('geographic_distance_km'):.1f} km")
    print(f"  Time Difference     : {features.get('time_difference_minutes')} minutes")
    print(f"  Dosage Volume       : {features.get('dosage_volume')}")
    print(f"  Duplicate Claim     : {features.get('duplicate_claim')}")
    
    print("\nReason:")
    print(f"  {result.get('reason')}")
    print("-" * 60)
