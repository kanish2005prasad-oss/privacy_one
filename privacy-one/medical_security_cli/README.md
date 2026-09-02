# Medical Security CLI Prototype

## Requirements
* Python 3.10+
* Ollama
* Llama 3.2 model

## Installation
```bash
python -m venv .venv
source .venv/bin/activate  # On macOS/Linux
# .venv\Scripts\activate   # On Windows

pip install -r requirements.txt
```

Install/run Ollama separately.
```bash
ollama pull llama3.2
```

## Running
```bash
python main.py
```

## Architecture
```text
Patient Input
     ↓
ChromaDB Retrieval
     ↓
Relevant Drug Evidence
     ↓
Rule-Based Risk Signals
     ↓
Ollama LLM
     ↓
Clinical Safety Result
```

and:
```text
Transaction Input
     ↓
Feature Extraction
     ↓
Isolation Forest
     ↓
Anomaly Detection
     ↓
Rule-Based Explanation
     ↓
Fraud Result
```

DISCLAIMER:
This prototype uses mock pharmacological reference data and an AI model for demonstration purposes only. It is not medical advice and must not be used to make real clinical or dispensing decisions. Medication decisions require review by a qualified healthcare professional.
