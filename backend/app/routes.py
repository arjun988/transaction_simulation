#routes.py
from flask import request, jsonify
from app import app, accounts_collection
from app.services import transfer_funds, create_account_service,TransactionManager
from app.audit_services import AuditService
from datetime import datetime, timedelta
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
    
audit_service = AuditService()

@app.route('/transfer_with_justification', methods=['POST'])
def transfer_with_justification():
    data = request.json
    sender_id = data['sender_id']
    recipient_id = data['recipient_id']
    amount = float(data['amount'])
    justification = data.get('justification', '')
    
    try:
        # Check for suspicious activity
        flags = audit_service.check_transaction(sender_id, recipient_id, amount, justification)
        
        # Create audit record
        transaction_id = str(datetime.utcnow().timestamp())
        audit_service.create_audit(transaction_id, sender_id, recipient_id, amount, justification)
        
        if flags:
            # If suspicious, require admin approval
            return jsonify({
                'status': 'pending_review',
                'transaction_id': transaction_id,
                'flags': flags,
                'message': 'Transaction requires admin review'
            }), 202
            
        # If not suspicious, proceed with transfer
        response = transfer_funds(sender_id, recipient_id, amount)
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/admin/pending_transfers', methods=['GET'])
def get_pending_transfers():
    try:
        pending_audits = list(audit_service.audit_collection.find({
            'status': 'pending'
        }))
        
        # Convert ObjectId to string for JSON serialization
        for audit in pending_audits:
            audit['_id'] = str(audit['_id'])
            
        return jsonify(pending_audits), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/admin/approve_transfer/<transaction_id>', methods=['POST'])
def approve_transfer(transaction_id):  # Add transaction_id parameter here
    try:
        # No need to get transaction_id from request.view_args since it's now a parameter
        audit = audit_service.audit_collection.find_one({'transaction_id': transaction_id})
        
        if not audit:
            return jsonify({'error': 'Transaction not found'}), 404
            
        # Update audit status
        audit_service.audit_collection.update_one(
            {'transaction_id': transaction_id},
            {'$set': {'status': 'approved'}}
        )
        
        # Execute the transfer
        response = transfer_funds(audit['sender_id'], audit['recipient_id'], audit['amount'])
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400