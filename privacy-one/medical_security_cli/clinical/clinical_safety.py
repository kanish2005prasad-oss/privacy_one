import os
import json
import chromadb
try:
    import ollama
except ImportError:
    ollama = None

from data.mock_drug_data import MOCK_PHARMACOLOGY_DOCS, DETERMINISTIC_INTERACTIONS

def initialize_vector_store():
    """Initializes an in-memory ChromaDB and populates it with mock reference documents."""
    client = chromadb.Client()
    collection = client.get_or_create_collection(name="pharmacology_reference")
    
    # Check if we need to add docs
    if collection.count() == 0:
        ids = [doc["id"] for doc in MOCK_PHARMACOLOGY_DOCS]
        documents = [doc["text"] for doc in MOCK_PHARMACOLOGY_DOCS]
        metadatas = [doc["metadata"] for doc in MOCK_PHARMACOLOGY_DOCS]
        
        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
    return collection

def retrieve_context(query: str, collection) -> list:
    """Retrieves relevant pharmacological documents for a query."""
    results = collection.query(
        query_texts=[query],
        n_results=2
    )
    documents = []
    if results and results.get("documents") and len(results["documents"]) > 0:
        documents = results["documents"][0]
    return documents

def check_deterministic_rules(current_meds: list, new_med: str) -> dict:
    new_med_lower = new_med.lower()
    for med in current_meds:
        med_lower = med.lower()
        for (drug1, drug2), rule in DETERMINISTIC_INTERACTIONS.items():
            if (drug1 in med_lower and drug2 in new_med_lower) or (drug2 in med_lower and drug1 in new_med_lower):
                return rule
    return None

def evaluate_medication_safety(
    patient_profile: dict,
    new_medication: str,
    vector_collection,
    llm_model: str = None
) -> dict:
    
    if llm_model is None:
        llm_model = os.getenv("OLLAMA_MODEL", "llama3.2")

    current_meds = patient_profile.get("current_medications", [])
    allergies = patient_profile.get("allergies", [])
    condition = patient_profile.get("condition", "Unknown")

    query = f"Interactions between {new_medication} and {', '.join(current_meds)}. Patient has allergies: {', '.join(allergies)}."
    
    retrieved_refs = retrieve_context(query, vector_collection)
    
    # 1. Deterministic check
    rule_match = check_deterministic_rules(current_meds, new_medication)
    
    base_risk = 10
    base_severity = "Low"
    interactions = []
    
    if rule_match:
        base_risk = rule_match["risk_score"]
        base_severity = rule_match["severity"]
        interactions.append({
            "drug": new_medication,
            "issue": rule_match["issue"],
            "severity": rule_match["severity"]
        })
    
    result = {
        "risk_score": base_risk,
        "severity": base_severity,
        "explanation": "No significant interactions identified based on limited demo data.",
        "interactions": interactions,
        "retrieved_references": retrieved_refs,
        "llm_status": "Available"
    }
    
    if rule_match:
        result["explanation"] = rule_match["explanation"]
    
    # 2. LLM explanation
    llm_prompt = f"""
    This is a prototype/demo.
    Use ONLY the supplied retrieved reference context for pharmacological evidence.
    Do not invent references.
    Identify interactions between existing medications and the new medication.
    Consider allergies and medical conditions.
    Explain uncertainty where appropriate.
    Do not diagnose the patient.
    Do not recommend changing medication without clinician review.
    Return concise clinical reasoning in JSON format.
    
    Patient Condition: {condition}
    Current Medications: {', '.join(current_meds)}
    Allergies: {', '.join(allergies)}
    New Medication: {new_medication}
    
    Retrieved Context:
    {' '.join(retrieved_refs)}
    
    Return JSON format:
    {{
        "clinical_assessment": "...",
        "interactions": [
            {{"drug": "...", "issue": "...", "severity": "..."}}
        ],
        "contraindications": [],
        "cautions": []
    }}
    """
    
    if ollama is not None:
        try:
            response = ollama.chat(model=llm_model, messages=[
                {"role": "system", "content": "You are a clinical assistant restricted to analyzing provided context. Produce only JSON."},
                {"role": "user", "content": llm_prompt}
            ], options={"format": "json"})
            
            response_content = response['message']['content']
            try:
                llm_data = json.loads(response_content)
            except json.JSONDecodeError:
                llm_data = {}
                result["llm_status"] = "JSON parse error from LLM"
            
            # Combine deterministic and LLM
            if llm_data.get("clinical_assessment"):
                result["explanation"] = llm_data["clinical_assessment"]
            
            if not rule_match and llm_data.get("interactions"):
                result["interactions"] = llm_data["interactions"]
                # Don't let LLM override our deterministic safe score drastically, but we can bump it
                result["risk_score"] = max(base_risk, 30 if len(result["interactions"]) > 0 else 10)
                result["severity"] = "Moderate" if result["risk_score"] >= 25 else "Low"
                
        except Exception as e:
            result["llm_status"] = f"unavailable — deterministic fallback used. (Error: {str(e)})"
    else:
        result["llm_status"] = "unavailable — ollama module not installed, deterministic fallback used."
        
    return result
