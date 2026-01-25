from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
import json
import traceback

app = Flask(__name__)
CORS(app)

# Resolve paths relative to this file so they work on Railway (any cwd).
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Startup logging
print(f"[STARTUP] Flask app initialized")
print(f"[STARTUP] Base directory: {_BASE_DIR}")
print(f"[STARTUP] Python version: {os.sys.version}")
print(f"[STARTUP] All routes registered successfully")

def _path(*parts):
    return os.path.join(_BASE_DIR, *parts)

# =========================================================
# ML MODELS - LAZY LOADED ONLY (never at import time)
# =========================================================
_model = None
_preprocessor = None
_label_encoder = None
_ml_load_attempted = False
_ml_load_error = None

def load_model():
    """
    Lazy-load ML artifacts ONLY when /predict is called.
    Never crashes the app - returns False on failure.
    """
    global _model, _preprocessor, _label_encoder, _ml_load_attempted, _ml_load_error
    
    # Already loaded successfully
    if _model is not None and _preprocessor is not None and _label_encoder is not None:
        return True
    
    # Already attempted and failed - don't retry
    if _ml_load_attempted and _ml_load_error is not None:
        return False
    
    _ml_load_attempted = True
    
    try:
        print("[ML] Attempting to load sklearn models...")
        _preprocessor = joblib.load(_path("amr_preprocessor.pkl"))
        print("[ML] Preprocessor loaded")
        _model = joblib.load(_path("amr_resistance_model.pkl"))
        print("[ML] Model loaded")
        _label_encoder = joblib.load(_path("amr_label_encoder.pkl"))
        print("[ML] Label encoder loaded")
        print("[ML] All models loaded successfully")
        return True
    except Exception as e:
        _ml_load_error = str(e)
        print(f"[ML] FAILED to load models: {e}")
        print("[ML] Full traceback:")
        print(traceback.format_exc())
        _model = None
        _preprocessor = None
        _label_encoder = None
        return False

# =========================================================
# Routes
# =========================================================

@app.route("/")
def home():
    return "AMR API is running"

# ---------------------------------------------------------
# Countries endpoint (FULL LIST, NO FILTERING)
# COMPLETELY ISOLATED - NO ML, NO GLOBAL STATE
# Always returns JSON array, never crashes
# ---------------------------------------------------------
@app.route("/countries", methods=["GET"])
def get_countries():
    try:
        # ISOLATED CSV LOAD - fresh every call, no global state
        csv_path = _path("Time series of resistance to antibiotics (2018-2023)_All-BLOOD.csv")
        df = pd.read_csv(csv_path, sep=",", skiprows=17)
        
        # Immediately clean column names
        df.columns = df.columns.str.strip()
        
        # Extract countries directly
        countries = (
            df["CountryTerritoryArea"]
            .dropna()
            .astype(str)
            .unique()
            .tolist()
        )
        countries.sort()
        
        print(f"Countries endpoint returned {len(countries)} items")
        return jsonify(countries)
    except Exception as e:
        print(f"[/countries] EXCEPTION: {e}")
        print(traceback.format_exc())
        return jsonify([])

# ---------------------------------------------------------
# Risk Lab / Surveillance Insight endpoint
# LAZY LOADS ML - graceful degradation if models fail
# ---------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    # Lazy load ML models (only happens here, never at import)
    if not load_model():
        return jsonify({
            "error": "Prediction service unavailable",
            "reason": _ml_load_error or "Model failed to load"
        }), 503

    if _model is None or _preprocessor is None or _label_encoder is None:
        return jsonify({
            "error": "Prediction service unavailable",
            "reason": "Model components not initialized"
        }), 503

    data = request.get_json(silent=True) or {}
    country = data.get("country")
    year = data.get("year")

    if not country or not year:
        return jsonify({"error": "country and year are required"}), 400

    # Fixed pair (intentional design choice)
    region = "Global"
    pathogen = "Acinetobacter spp."
    antibiotic = "Amikacin"

    if int(year) > 2023:
        explanation = (
            "For years beyond 2023, antimicrobial resistance surveillance "
            "data is not available. This output reflects trend-based patterns "
            "derived from historical observations."
        )
    else:
        explanation = (
            "This assessment is derived from antimicrobial resistance "
            "surveillance data collected between 2018 and 2023."
        )

    try:
        # Build input dataframe
        input_df = pd.DataFrame([{
            "CountryTerritoryArea": country,
            "WHORegionName": region,
            "PathogenName": pathogen,
            "AbTargets": antibiotic,
            "Year": year
        }])

        # Run prediction
        X_processed = _preprocessor.transform(input_df)
        prediction_encoded = _model.predict(X_processed)
        prediction_label = _label_encoder.inverse_transform(prediction_encoded)
        raw_output = str(prediction_label[0]).lower()

        # Map to assessment
        if "high" in raw_output:
            assessment = "Higher probability of resistant strains surviving"
        elif "medium" in raw_output:
            assessment = "Moderate selective pressure observed"
        else:
            assessment = "Lower selective pressure observed"

        return jsonify({
            "assessment": assessment,
            "explanation": explanation,
            "context": "Population-level surveillance insight",
            "pair_locked": "Acinetobacter spp. + Amikacin"
        })

    except Exception as e:
        print(f"[/predict] Error during prediction: {e}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# Selective Pressure Lab - NO ML, JSON ONLY
# Always returns array, never crashes
# ---------------------------------------------------------
@app.route("/selective-pressure", methods=["GET"])
def selective_pressure():
    try:
        path = _path("selective_pressure_clusters.json")
        if not os.path.exists(path):
            print(f"[/selective-pressure] File not found: {path}")
            return jsonify([])
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            print(f"[/selective-pressure] Data is not a list: {type(data)}")
            return jsonify([])
        print(f"[/selective-pressure] Returned {len(data)} items")
        return jsonify(data)
    except Exception as e:
        print(f"[/selective-pressure] Error: {e}")
        print(traceback.format_exc())
        return jsonify([])

# ---------------------------------------------------------
# Exposure Pathways Explorer - NO ML, JSON ONLY
# Always returns array, never crashes
# ---------------------------------------------------------
@app.route("/exposure-pathways", methods=["GET"])
def exposure_pathways():
    try:
        path = _path("exposure_pathways.json")
        if not os.path.exists(path):
            print(f"[/exposure-pathways] File not found: {path}")
            return jsonify([])
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            print(f"[/exposure-pathways] Data is not a list: {type(data)}")
            return jsonify([])
        print(f"[/exposure-pathways] Returned {len(data)} items")
        return jsonify(data)
    except Exception as e:
        print(f"[/exposure-pathways] Error: {e}")
        print(traceback.format_exc())
        return jsonify([])

# =========================================================
# Run app
# =========================================================
if __name__ == "__main__":
    app.run(debug=True)
