from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
import requests
import logging
from datetime import timedelta

# Import the client data service and routes
from database.client_data_service import ClientDataService
from routes.client_routes import init_client_routes

# 🔄 Încarcă .env
load_dotenv()
print("DEBUG: .env loaded =", load_dotenv())
print("DEBUG: JWT_SECRET =", os.environ.get("JWT_SECRET"))


# 🔐 Config Flask & JWT
app = Flask(__name__)
JWT_SECRET_KEY = os.environ.get("JWT_SECRET")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET is not set in the environment (.env)")

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

# 🔐 Cheie API pentru Mortgage Calculator
API_NINJAS_KEY = os.environ.get("API_NINJAS")

# 📝 Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

# 🧪 Utilizatori simpli hardcodați
USERS = {
    "admin": "1234"
}

# Initialize client data service
# Update the path to match your actual file location
client_data_service = ClientDataService("/Users/tiberiuuuf/Desktop/banking-dashboard/backend/database/data/sample_clients.csv")

# Initialize client routes
init_client_routes(app, client_data_service)

# 🔐 Login → JWT
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if USERS.get(username) != password:
        logging.warning(f"Login failed for user: {username}")
        return jsonify({"msg": "Bad credentials"}), 401

    access_token = create_access_token(identity=username)
    logging.info(f"User {username} logged in.")
    return jsonify(access_token=access_token)

# 🔐 Endpoint protejat
@app.route('/calculate-mortgage', methods=['POST'])
@jwt_required()
def calculate_mortgage():
    current_user = get_jwt_identity()
    logging.info(f"{current_user} accessed /calculate-mortgage")

    data = request.get_json()
    
    if 'interest_rate' not in data:
        return jsonify({'error': 'interest_rate is required'}), 400

    has_loan_amount = 'loan_amount' in data
    has_home_value_and_downpayment = 'home_value' in data and 'downpayment' in data

    if not (has_loan_amount or has_home_value_and_downpayment):
        return jsonify({'error': 'Either loan_amount or both home_value and downpayment must be provided.'}), 400
    
    allowed_params = [
        "loan_amount",
        "home_value",
        "downpayment",
        "interest_rate",  # obligatoriu
        "duration_years",
        "monthly_hoa",
        "annual_property_tax",
        "annual_home_insurance"
    ]

    params = {k: data[k] for k in allowed_params if k in data}

    response = requests.get(
        'https://api.api-ninjas.com/v1/mortgagecalculator',
        headers={'X-Api-Key': API_NINJAS_KEY},
        params=params
    )

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        logging.error(f"API error: {response.text}")
        return jsonify({'error': 'External API error', 'details': response.json()}), response.status_code

# 🛑 Catch-all error logger
@app.errorhandler(Exception)
def handle_exception(e):
    logging.exception("Unhandled exception occurred")
    return jsonify({"error": "Internal server error"}), 500

@app.route("/")
def home():
    try:
        tail = request.args.get("tail", default=50, type=int)  # default: ultimele 50
        with open("app.log", "r") as f:
            lines = f.readlines()

        # selectează ultimele N linii și inversează ordinea
        if tail is not None:
            lines = lines[-tail:][::-1]

        return f"<pre>{''.join(lines)}</pre>"

    except Exception as e:
        logging.error("Could not read log file.")
        return "Eroare la citirea fișierului log.", 500


if __name__ == '__main__':
    app.run(debug=True)