#services.py
from flask import jsonify
from app import accounts_collection, client
from app.transaction_manager import TransactionManager

def transfer_funds(sender_id, recipient_id, amount):
    transaction_manager = TransactionManager()
    
    try:
        # Verify accounts and balance first
        sender = accounts_collection.find_one({"_id": sender_id})
        recipient = accounts_collection.find_one({"_id": recipient_id})
        
        if not sender:
            return jsonify({"error": "Sender account not found"}), 404
        if not recipient:
            return jsonify({"error": "Recipient account not found"}), 404
        if sender['balance'] < amount:
            return jsonify({"error": "Insufficient funds"}), 400
            
        operations = [
            {
                'collection': 'accounts',
                'type': 'update',
                'filter': {'_id': sender_id},
                'update': {'$inc': {'balance': -amount}}
            },
            {
                'collection': 'accounts',
                'type': 'update',
                'filter': {'_id': recipient_id},
                'update': {'$inc': {'balance': amount}}
            }
        ]
        
        success, transaction_id, message = transaction_manager.execute_operations(operations)
        
        if success:
            return jsonify({
                "message": "Transfer successful!",
                "transaction_id": transaction_id
            }), 200
        else:
            return jsonify({
                "error": message,
                "transaction_id": transaction_id
            }), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def create_account_service(account_id, account_holder, balance):
    transaction_manager = TransactionManager()
    
    new_account = {
        "_id": account_id,
        "account_holder": account_holder,
        "balance": balance
    }
    
    operations = [{
        'collection': 'accounts',
        'type': 'insert',
        'document': new_account
    }]
    
    try:
        success, transaction_id, message = transaction_manager.execute_operations(operations)
        if success:
            return jsonify({
                "message": "Account created!",
                "transaction_id": transaction_id
            }), 201
        else:
            return jsonify({
                "error": message,
                "transaction_id": transaction_id
            }), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400