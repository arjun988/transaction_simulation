import unittest
from app import app

class TestTransactionSimulation(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_create_account(self):
        response = self.app.post('/account', json={
            "_id": "acc123",
            "account_holder": "John Doe",
            "balance": 1000
        })
        self.assertEqual(response.status_code, 201)

    def test_transfer_funds_success(self):
        response = self.app.post('/transfer', json={
            "sender_id": "acc123",
            "recipient_id": "acc124",
            "amount": 500
        })
        self.assertEqual(response.status_code, 200)

    def test_transfer_funds_insufficient_balance(self):
        response = self.app.post('/transfer', json={
            "sender_id": "acc123",
            "recipient_id": "acc124",
            "amount": 2000
        })
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    unittest.main()
