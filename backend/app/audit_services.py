from datetime import datetime, timedelta
from app import db

class AuditService:
    def __init__(self):
        self.audit_collection = db['transaction_audits']
        self.threshold_amount = 10000  # Configure threshold for large transactions
        self.suspicious_keywords = [
            'urgent', 'emergency', 'confidential', 'private',
            'quick', 'secret', 'undisclosed'
        ]
        
    def create_audit(self, transaction_id, sender_id, recipient_id, amount, justification):
        audit = {
            'transaction_id': transaction_id,
            'sender_id': sender_id,
            'recipient_id': recipient_id,
            'amount': amount,
            'justification': justification,
            'flags': [],
            'status': 'pending',
            'timestamp': datetime.utcnow()
        }
        return self.audit_collection.insert_one(audit)

    def check_transaction(self, sender_id, recipient_id, amount, justification):
        flags = []
        
        # Check for large transactions
        if amount > self.threshold_amount:
            flags.append({
                'type': 'large_amount',
                'message': f'Transaction amount (${amount}) exceeds threshold (${self.threshold_amount})'
            })
            
        # Check for frequency of transactions
        recent_transactions = self.audit_collection.count_documents({
            'sender_id': sender_id,
            'timestamp': {'$gte': datetime.utcnow() - timedelta(hours=24)}
        })
        if recent_transactions > 5:  # More than 5 transactions in 24 hours
            flags.append({
                'type': 'high_frequency',
                'message': f'High transaction frequency detected ({recent_transactions} in 24h)'
            })
            
        # Check for missing or suspicious justification
        if not justification or len(justification.strip()) < 10:
            flags.append({
                'type': 'suspicious_justification',
                'message': 'Missing or insufficient transaction justification'
            })
        
        # Check for suspicious keywords in justification
        if justification:
            found_keywords = [
                keyword for keyword in self.suspicious_keywords 
                if keyword.lower() in justification.lower()
            ]
            if found_keywords:
                flags.append({
                    'type': 'suspicious_keywords',
                    'message': f'Suspicious keywords detected: {", ".join(found_keywords)}'
                })
            
        return flags