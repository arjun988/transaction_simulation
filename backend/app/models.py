# Account model schema example
def create_account_document(account_id, account_holder, balance):
    return {
        "_id": account_id,
        "account_holder": account_holder,
        "balance": balance
    }
