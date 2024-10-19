#routes.py
from flask import request, jsonify
from app import app, accounts_collection
from app.services import transfer_funds, create_account_service,TransactionManager

# Route to create a new account
@app.route('/account', methods=['POST'])
def create_account():
    data = request.json
    account_id = data['_id']
    account_holder = data['account_holder']
    balance = data['balance']
    
    response = create_account_service(account_id, account_holder, balance)
    return response

@app.route('/account_details',methods=['GET'])
def get_all_accounts():
    try:
        accounts = list(accounts_collection.find({}))
        # Convert MongoDB ObjectId to string for JSON serialization
        for account in accounts:
            account['_id'] = str(account['_id'])
        return jsonify(accounts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# Route to transfer money between two accounts
@app.route('/transfer', methods=['POST'])
def transfer_money():
    data = request.json
    sender_id = data['sender_id']
    recipient_id = data['recipient_id']
    amount = data['amount']
    
    # Call the service to handle transfer
    response = transfer_funds(sender_id, recipient_id, amount)
    return response

@app.route('/transaction/<transaction_id>', methods=['GET'])
def get_transaction_status(transaction_id):
    try:
        transaction_manager = TransactionManager()
        logs = transaction_manager.logger.get_transaction_logs(transaction_id)
        
        if not logs:
            return jsonify({"error": "Transaction not found"}), 404
            
        latest_log = logs[-1]
        return jsonify({
            "transaction_id": transaction_id,
            "status": latest_log['status'],
            "timestamp": latest_log['timestamp'],
            "logs": logs
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500