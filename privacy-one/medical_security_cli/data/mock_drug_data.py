MOCK_PHARMACOLOGY_DOCS = [
    {
        "id": "ref_1",
        "text": "Lisinopril is an ACE inhibitor. Ibuprofen is an NSAID. NSAIDs can reduce the antihypertensive effect of ACE inhibitors and increase renal stress/risk, particularly in susceptible patients. High-dose or prolonged NSAID use deserves additional caution.",
        "metadata": {
            "drug": "ibuprofen",
            "interacts_with": "lisinopril",
            "category": "drug_interaction",
            "severity": "high"
        }
    },
    {
        "id": "ref_2",
        "text": "Azithromycin is a macrolide antibiotic structurally unrelated to penicillin. Penicillin allergy does not automatically imply azithromycin allergy. The actual indication and individual patient factors still matter.",
        "metadata": {
            "drug": "azithromycin",
            "interacts_with": "penicillin",
            "category": "allergy_alternative",
            "severity": "low"
        }
    },
    {
        "id": "ref_3",
        "text": "Warfarin combined with NSAIDs can significantly increase the risk of bleeding. Concurrent use should be avoided or closely monitored.",
        "metadata": {
            "drug": "nsaids",
            "interacts_with": "warfarin",
            "category": "drug_interaction",
            "severity": "high"
        }
    }
]

DETERMINISTIC_INTERACTIONS = {
    ("lisinopril", "ibuprofen"): {
        "risk_score": 90,
        "severity": "Critical",
        "explanation": "High risk interaction detected: NSAID (ibuprofen) may reduce ACE inhibitor (lisinopril) efficacy and increase renal stress risk. Professional clinical review is strongly recommended.",
        "issue": "NSAID + ACE inhibitor interaction"
    }
}

CITY_COORDINATES = {
    "Chennai": (13.0827, 80.2707),
    "Delhi": (28.7041, 77.1025),
    "Mumbai": (19.0760, 72.8777),
    "Bengaluru": (12.9716, 77.5946),
    "Hyderabad": (17.3850, 78.4867)
}
