<<<<<<< HEAD
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

# =========================================================
# Load dataset (USED ONLY FOR COUNTRY LIST)
# =========================================================
df = pd.read_csv(
    "Time series of resistance to antibiotics (2018-2023)_All-BLOOD.csv",
    sep=",",
    skiprows=17
)

# =========================================================
# Load trained ML artifacts (UNCHANGED)
# =========================================================
model = joblib.load("amr_resistance_model.pkl")
preprocessor = joblib.load("amr_preprocessor.pkl")
label_encoder = joblib.load("amr_label_encoder.pkl")

# =========================================================
# Internal prediction helper (UNCHANGED)
# =========================================================
def predict_resistance(country, region, pathogen, antibiotic, year):
    input_df = pd.DataFrame([{
        "CountryTerritoryArea": country,
        "WHORegionName": region,
        "PathogenName": pathogen,
        "AbTargets": antibiotic,
        "Year": year
    }])

    X_processed = preprocessor.transform(input_df)
    prediction_encoded = model.predict(X_processed)
    prediction_label = label_encoder.inverse_transform(prediction_encoded)

    return prediction_label[0]

# =========================================================
# Routes
# =========================================================

@app.route("/")
def home():
    return "AMR API is running"

# ---------------------------------------------------------
# Countries endpoint (FULL LIST, NO FILTERING)
# ---------------------------------------------------------
@app.route("/countries", methods=["GET"])
def get_countries():
    countries = (
        df["CountryTerritoryArea"]
        .dropna()
        .unique()
        .tolist()
    )
    countries.sort()
    return jsonify(countries)

# ---------------------------------------------------------
# Risk Lab / Surveillance Insight endpoint
# ---------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    country = data.get("country")
    year = data.get("year")

    if not country or not year:
        return jsonify({"error": "Country and year are required"}), 400

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
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# Model 1: Selective Pressure Lab (READ FULL JSON)
# ---------------------------------------------------------
@app.route("/selective-pressure", methods=["GET"])
def selective_pressure():
    path = "selective_pressure_clusters.json"

    if not os.path.exists(path):
        return jsonify({"error": "Selective pressure data file not found"}), 500

    data = pd.read_json(path)
    return jsonify(data.to_dict(orient="records"))

# ---------------------------------------------------------
# Model 2: Exposure Pathways Explorer (READ FULL JSON)
# ---------------------------------------------------------
@app.route("/exposure-pathways", methods=["GET"])
def exposure_pathways():
    path = "exposure_pathways.json"

    if not os.path.exists(path):
        return jsonify({"error": "Exposure pathways data file not found"}), 500

    data = pd.read_json(path)
    return jsonify(data.to_dict(orient="records"))

# =========================================================
# Run app
# =========================================================
if __name__ == "__main__":
    app.run(debug=True)
=======
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

# =========================================================
# Load dataset (USED ONLY FOR COUNTRY LIST)
# =========================================================
df = pd.read_csv(
    "Time series of resistance to antibiotics (2018-2023)_All-BLOOD.csv",
    sep=",",
    skiprows=17
)

# =========================================================
# Load trained ML artifacts (UNCHANGED)
# =========================================================
model = joblib.load("amr_resistance_model.pkl")
preprocessor = joblib.load("amr_preprocessor.pkl")
label_encoder = joblib.load("amr_label_encoder.pkl")

# =========================================================
# Internal prediction helper (UNCHANGED)
# =========================================================
def predict_resistance(country, region, pathogen, antibiotic, year):
    input_df = pd.DataFrame([{
        "CountryTerritoryArea": country,
        "WHORegionName": region,
        "PathogenName": pathogen,
        "AbTargets": antibiotic,
        "Year": year
    }])

    X_processed = preprocessor.transform(input_df)
    prediction_encoded = model.predict(X_processed)
    prediction_label = label_encoder.inverse_transform(prediction_encoded)

    return prediction_label[0]

# =========================================================
# Routes
# =========================================================

@app.route("/")
def home():
    return "AMR API is running"

# ---------------------------------------------------------
# Countries endpoint (FULL LIST, NO FILTERING)
# ---------------------------------------------------------
@app.route("/countries", methods=["GET"])
def get_countries():
    countries = (
        df["CountryTerritoryArea"]
        .dropna()
        .unique()
        .tolist()
    )
    countries.sort()
    return jsonify(countries)

# ---------------------------------------------------------
# Risk Lab / Surveillance Insight endpoint
# ---------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    country = data.get("country")
    year = data.get("year")

    if not country or not year:
        return jsonify({"error": "Country and year are required"}), 400

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
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# Model 1: Selective Pressure Lab (READ FULL JSON)
# ---------------------------------------------------------
@app.route("/selective-pressure", methods=["GET"])
def selective_pressure():
    path = "selective_pressure_clusters.json"

    if not os.path.exists(path):
        return jsonify({"error": "Selective pressure data file not found"}), 500

    data = pd.read_json(path)
    return jsonify(data.to_dict(orient="records"))

# ---------------------------------------------------------
# Model 2: Exposure Pathways Explorer (READ FULL JSON)
# ---------------------------------------------------------
@app.route("/exposure-pathways", methods=["GET"])
def exposure_pathways():
    path = "exposure_pathways.json"

    if not os.path.exists(path):
        return jsonify({"error": "Exposure pathways data file not found"}), 500

    data = pd.read_json(path)
    return jsonify(data.to_dict(orient="records"))

# =========================================================
# Run app
# =========================================================
if __name__ == "__main__":
    app.run(debug=True)
>>>>>>> cc496ced77502ba92e93b2a8e0ce762ca9571e36
