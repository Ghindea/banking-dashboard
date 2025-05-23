from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS  # Import CORS for cross-origin requests
from dotenv import load_dotenv
import os
import requests
import logging
from datetime import timedelta
import json


# Import the client data service and routes
from database.client_data_service import ClientDataService
from database.user_service import UserService
from routes.client_routes import init_client_routes

# Load .env file
load_dotenv()

# Configure Flask & JWT
app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

JWT_SECRET_KEY = os.environ.get("JWT_SECRET")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET is not set in the environment (.env)")

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

# API key for Mortgage Calculator
API_NINJAS_KEY = os.environ.get("API_NINJAS")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

# Hardcoded admin user for development
USERS = {
    "admin": "1234"
}

# Initialize client data service
# Update the path to match your actual file location
client_data_service = ClientDataService("database/database.db")

# Initialize user service for managing user authentication and data caching
user_service = UserService(client_data_service)

# Initialize client routes
init_client_routes(app, client_data_service)

with open("recommender/mapper.json", "r") as f:
    mapper = json.load(f)

# Login endpoint
# In backend/app.py, modify the login endpoint:

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user_id = data.get("userId")
    password = data.get("password")
    
    # Check if this is an admin login
    if user_id == "admin" and USERS.get("admin") == password:
        access_token = create_access_token(identity="admin")
        logging.info(f"Admin logged in.")
        return jsonify(access_token=access_token, user_type="admin")
    
    # Regular user authentication by ID
    if user_service.authenticate_user(user_id):
        # Get user data and cache it
        user_data = user_service.get_user_data(user_id)
        
        if user_data:
            # *** ADD THESE PRINT STATEMENTS ***
            print(f"\n{'='*50}")
            print(f"CLIENT LOGIN SUCCESSFUL - ID: {user_id}")
            print(f"{'='*50}")
            
            # Print all client features
            for key, value in user_data.items():
                print(f"{key}: {value}")
            
            print(f"{'='*50}")
            print(f"Total features cached: {len(user_data)}")
            print(f"{'='*50}\n")
            
            # Create a token with the user ID
            access_token = create_access_token(identity=user_id)
            logging.info(f"User {user_id} logged in.")
            
            return jsonify(
                access_token=access_token,
                user_type="client",
                user_id=user_id
            )
    
    logging.warning(f"Login failed for user ID: {user_id}")
    return jsonify({"msg": "Invalid user ID"}), 401

# Get user profile endpoint
# In backend/app.py, modify the get_user_profile endpoint:

@app.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user = get_jwt_identity()
    
    # Admin doesn't have a profile
    if current_user == "admin":
        return jsonify({"error": "Admin has no profile"}), 400
    
    # Get user data from cache
    user_data = user_service.get_user_data(current_user)
    
    if not user_data:
        return jsonify({"error": "User not found"}), 404
    
    # *** ADD THESE PRINT STATEMENTS ***
    print(f"\n{'='*50}")
    print(f"PROFILE ACCESSED - ID: {current_user}")
    print(f"{'='*50}")
    print(f"Serving cached data with {len(user_data)} features")
    
    # Print some key features
    key_features = ['ID', 'GPI_AGE', 'GPI_CUSTOMER_TYPE_DESC', 'CLIENT_TENURE']
    for feature in key_features:
        if feature in user_data:
            print(f"  {feature}: {user_data[feature]}")
    
    print(f"{'='*50}\n")
    
    return jsonify(user_data)

@app.route('/user/products', methods=['GET'])
@jwt_required()
def get_user_products():
    current_user = get_jwt_identity()

    logging.info(f"{current_user} accessed /user/products")

    # Get user data
    user_data = user_service.get_user_data(current_user)
    print(current_user)
    
    if not user_data:
        return jsonify({"error": "User not found"}), 404

    products = client_data_service.get_products_for_client(current_user)

    logging.info(f"Products for {current_user}: {products}")

    return jsonify({"products": products})

@app.route('/user/offers', methods=['GET'])
@jwt_required()
def get_user_offers():
    current_user = get_jwt_identity()

    logging.info(f"{current_user} accessed /user/offers")

    # Get user data
    user_data = user_service.get_user_data(current_user)
    
    if not user_data:
        return jsonify({"error": "User not found"}), 404

    offers = client_data_service.get_offers_for_client(current_user)

    logging.info(f"Offers for {current_user}: {offers}")

    return jsonify({"offers": offers})

# Calculate mortgage endpoint
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
        "interest_rate",  # required
        "duration_years",
        "monthly_hoa",
        "annual_property_tax",
        "annual_home_insurance"
    ]

    params = {k: data[k] for k in allowed_params if k in data}

    try:
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
    except Exception as e:
        logging.error(f"Mortgage calculation error: {str(e)}")
        return jsonify({'error': 'Failed to calculate mortgage', 'message': str(e)}), 500


# Get all client IDs (for development only)
@app.route('/clients/list', methods=['GET'])
@jwt_required()
def list_clients():
    current_user = get_jwt_identity()
    
    # Only admin can access this endpoint
    if current_user != "admin":
        return jsonify({"error": "Unauthorized"}), 403
    
    # Get the first 20 client IDs for testing
    client_ids = client_data_service.client_ids[:20]
    
    return jsonify({
        "total_clients": len(client_data_service.client_ids),
        "sample_clients": client_ids
    })

# Catch-all error logger
@app.errorhandler(Exception)
def handle_exception(e):
    logging.exception("Unhandled exception occurred")
    return jsonify({"error": "Internal server error"}), 500

# Home page shows logs
@app.route("/")
def home():
    try:
        tail = request.args.get("tail", default=50, type=int)  # default: last 50 lines
        with open("app.log", "r") as f:
            lines = f.readlines()

        # Select the last N lines and reverse the order
        if tail is not None:
            lines = lines[-tail:][::-1]

        return f"<pre>{''.join(lines)}</pre>"

    except Exception as e:
        logging.error(f"Could not read log file: {str(e)}")
        return "Error reading log file.", 500

# Health check endpoint
@app.route("/health")
def health_check():
    return jsonify({"status": "ok", "message": "Server is running"}), 200

# Add this endpoint to backend/app.py for testing different client IDs
@app.route('/debug/sample-clients', methods=['GET'])
def debug_sample_clients():
    """Get sample client IDs with some basic info for testing"""
    try:
        # Get first 10 clients with some basic info
        sample_size = min(10, len(client_data_service.client_ids))
        sample_clients = []
        
        for i in range(sample_size):
            client_id = client_data_service.client_ids[i]
            client_data = client_data_service.get_client_data(client_id)
            
            if client_data:
                sample_clients.append({
                    "id": client_id,
                    "age": client_data.get("GPI_AGE", "N/A"),
                    "occupation": client_data.get("GPI_CLS_CODE_PT_OCCUP", "N/A"),
                    "customer_type": client_data.get("GPI_CUSTOMER_TYPE_DESC", "N/A"),
                    "total_balance": client_data.get("CEC_TOTAL_BALANCE_AMT", 0),
                    "has_digital_services": client_data.get("PTS_IB_FLAG") == "Y"
                })
        
        return jsonify({
            "total_clients": len(client_data_service.client_ids),
            "sample_clients": sample_clients
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/favicon.ico')
def favicon():
    return "", 204


if __name__ == '__main__':
    app.run(debug=True)
