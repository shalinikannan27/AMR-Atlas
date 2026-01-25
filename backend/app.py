from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
import json

app = Flask(__name__)
CORS(app)

# Resolve paths relative to this file so they work on Railway (any cwd).
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def _path(*parts):
    return os.path.join(_BASE_DIR, *parts)

# =========================================================
# Safe ML loading (app must start even if ML fails)
# =========================================================
_model = None
_preprocessor = None
_label_encoder = None
_ml_load_error = None

def load_model():
    """Lazy-load ML artifacts. Safe: never crashes the app."""
    global _model, _preprocessor, _label_encoder, _ml_load_error
    if _model is not None:
        return True  # already loaded
    if _ml_load_error is not None:
        return False  # already failed, don't retry
    try:
        _preprocessor = joblib.load(_path("amr_preprocessor.pkl"))
        _model = joblib.load(_path("amr_resistance_model.pkl"))
        _label_encoder = joblib.load(_path("amr_label_encoder.pkl"))
        print("[ML] Model loaded successfully")
        return True
    except Exception as e:
        _ml_load_error = str(e)
        print(f"[ML] Failed to load model: {e}")
        _model = None
        _preprocessor = None
        _label_encoder = None
        return False

# =========================================================
# Safe CSV loading for country list
# =========================================================
_df = None
_df_load_error = None

def _load_csv():
    global _df, _df_load_error
    if _df is not None:
        return _df
    if _df_load_error is not None:
        return None
    try:
        csv_path = _path("Time series of resistance to antibiotics (2018-2023)_All-BLOOD.csv")
        _df = pd.read_csv(csv_path, sep=",", skiprows=17)
        print(f"[CSV] Loaded. Columns: {list(_df.columns)}")
        return _df
    except Exception as e:
        _df_load_error = str(e)
        print(f"[CSV] Failed to load: {e}")
        return None

# Load CSV at startup (safe)
_load_csv()

# =========================================================
# Internal prediction helper (uses lazy-loaded _model, etc.)
# =========================================================
def predict_resistance(country, region, pathogen, antibiotic, year):
    input_df = pd.DataFrame([{
        "CountryTerritoryArea": country,
        "WHORegionName": region,
        "PathogenName": pathogen,
        "AbTargets": antibiotic,
        "Year": year
    }])

    X_processed = _preprocessor.transform(input_df)
    prediction_encoded = _model.predict(X_processed)
    prediction_label = _label_encoder.inverse_transform(prediction_encoded)

    return prediction_label[0]

# =========================================================
# Routes
# =========================================================

@app.route("/")
def home():
    return "AMR API is running"

# ---------------------------------------------------------
# Countries endpoint (FULL LIST, NO FILTERING)
# Always returns JSON array, never crashes
# Dynamically detects country column if needed
# ---------------------------------------------------------
def _find_country_column(df):
    """
    Find the best column for country names.
    Priority:
    1. Exact match: 'CountryTerritoryArea'
    2. Any column containing 'country' (case-insensitive)
    3. First string column with >10 unique values (not 'Unnamed')
    """
    # Priority 1: exact match
    if "CountryTerritoryArea" in df.columns:
        return "CountryTerritoryArea"
    
    # Priority 2: column containing 'country'
    for col in df.columns:
        if "country" in str(col).lower():
            return col
    
    # Priority 3: first good string column
    for col in df.columns:
        col_str = str(col)
        if col_str.lower().startswith("unnamed"):
            continue
        if df[col].dtype == "object":
            unique_count = df[col].dropna().nunique()
            if unique_count > 10:
                return col
    
    return None

@app.route("/countries", methods=["GET"])
def get_countries():
    try:
        df = _load_csv()
        if df is None:
            print("[/countries] CSV not loaded")
            return jsonify([])
        
        col = _find_country_column(df)
        if col is None:
            print(f"[/countries] No suitable country column found. Available: {list(df.columns)}")
            return jsonify([])
        
        print(f"[/countries] Using country column: {col}")
        countries = df[col].dropna().unique().tolist()
        countries = [str(c).strip() for c in countries if c and str(c).strip()]
        countries.sort()
        return jsonify(countries)
    except Exception as e:
        print(f"[/countries] Error: {e}")
        return jsonify([])

# ---------------------------------------------------------
# Risk Lab / Surveillance Insight endpoint
# Returns 503 if ML unavailable (graceful degradation)
# ---------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    # Attempt to load ML (safe)
    if not load_model():
        return jsonify({"error": "Prediction service unavailable"}), 503

    if _model is None or _preprocessor is None or _label_encoder is None:
        return jsonify({"error": "Prediction service unavailable"}), 503

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
        raw_output = predict_resistance(
            country=country,
            region=region,
            pathogen=pathogen,
            antibiotic=antibiotic,
            year=year
        ).lower()

        # ---------------------------------------------
        # LANGUAGE SHIFT (NO HIGH / MEDIUM / LOW RISK)
        # ---------------------------------------------
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
        print(f"[/predict] Error: {e}")
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# Model 1: Selective Pressure Lab (READ FULL JSON)
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
        return jsonify(data)
    except Exception as e:
        print(f"[/selective-pressure] Error: {e}")
        return jsonify([])

# ---------------------------------------------------------
# Model 2: Exposure Pathways Explorer (READ FULL JSON)
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
        return jsonify(data)
    except Exception as e:
        print(f"[/exposure-pathways] Error: {e}")
        return jsonify([])

# =========================================================
# Run app
# =========================================================
if __name__ == "__main__":
    app.run(debug=True)
