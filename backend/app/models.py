from datetime import datetime, timedelta
def create_account_document(account_id, account_holder, balance):
    return {
        "_id": account_id,
        "account_holder": account_holder,
        "balance": balance
    }
class TransactionAudit:
    def __init__(self, transaction_id, sender_id, recipient_id, amount, justification):
        self.transaction_id = transaction_id
        self.sender_id = sender_id
        self.recipient_id = recipient_id
        self.amount = amount
        self.justification = justification
        self.flags = []
        self.status = 'pending'
        self.timestamp = datetime.utcnow()