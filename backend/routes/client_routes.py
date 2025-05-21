from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
from typing import Dict, Any

# Create a blueprint for client data endpoints
client_bp = Blueprint('client', __name__, url_prefix='/api/clients')

# This will be initialized in app.py
client_service = None

def init_client_routes(app, data_service):
    """Initialize the client routes with the data service."""
    global client_service
    client_service = data_service
    app.register_blueprint(client_bp)
    logging.info("Client routes initialized")

@client_bp.route('/', methods=['GET'])
@jwt_required()
def get_clients():
    """Get clients based on query parameters."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} accessed client list.")
        
        # Extract query parameters
        query_params = request.args.to_dict(flat=True)
        
        # Apply pagination if provided
        page = int(query_params.pop('page', 1))
        page_size = int(query_params.pop('page_size', 50))
        
        # Use the client service to search
        clients = client_service.search_clients(query_params)
        
        # Apply pagination
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_clients = clients[start_idx:end_idx]
        
        return jsonify({
            'data': paginated_clients,
            'total': len(clients),
            'page': page,
            'page_size': page_size,
            'total_pages': (len(clients) - 1) // page_size + 1
        })
    except Exception as e:
        logging.error(f"Error getting clients: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route('/<client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    """Get a single client by ID."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} accessed client {client_id}.")
        
        client = client_service.get_client_by_id(client_id)
        
        if client is None:
            return jsonify({"error": "Client not found"}), 404
        
        return jsonify(client)
    except Exception as e:
        logging.error(f"Error getting client {client_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route('/segments', methods=['GET'])
@jwt_required()
def get_segments():
    """Get client segments."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} accessed client segments.")
        
        segments = client_service.get_client_segments()
        return jsonify(segments)
    except Exception as e:
        logging.error(f"Error getting client segments: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route('/balances', methods=['GET'])
@jwt_required()
def get_balances():
    """Get average balances by account type."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} accessed balance statistics.")
        
        balances = client_service.get_average_balances()
        return jsonify(balances)
    except Exception as e:
        logging.error(f"Error getting balance statistics: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get transaction statistics."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} accessed transaction statistics.")
        
        transactions = client_service.get_transaction_statistics()
        return jsonify(transactions)
    except Exception as e:
        logging.error(f"Error getting transaction statistics: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route('/spending', methods=['GET'])
@jwt_required()
def get_spending():
    """Get spending patterns."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} accessed spending patterns.")
        
        spending = client_service.analyze_spending_patterns()
        return jsonify(spending)
    except Exception as e:
        logging.error(f"Error getting spending patterns: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route('/digital-engagement', methods=['GET'])
@jwt_required()
def get_digital_engagement():
    """Get digital engagement statistics."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} accessed digital engagement statistics.")
        
        stats = client_service.get_digital_engagement_stats()
        return jsonify(stats)
    except Exception as e:
        logging.error(f"Error getting digital engagement statistics: {str(e)}")
        return jsonify({"error": str(e)}), 500

@client_bp.route('/refresh', methods=['POST'])
@jwt_required()
def refresh_data():
    """Refresh client data from source."""
    try:
        current_user = get_jwt_identity()
        logging.info(f"User {current_user} requested data refresh.")
        
        client_service.refresh_data()
        return jsonify({"message": "Data refreshed successfully"})
    except Exception as e:
        logging.error(f"Error refreshing data: {str(e)}")
        return jsonify({"error": str(e)}), 500