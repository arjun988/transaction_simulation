from datetime import datetime
import logging
from flask import jsonify
from pymongo.errors import OperationFailure
from app import db
class TransactionLogger:
    def __init__(self):
        self.log_collection = db['transaction_logs']
        
    def log_transaction(self, transaction_id, operation, data, status):
        log_entry = {
            'transaction_id': transaction_id,
            'timestamp': datetime.utcnow(),
            'operation': operation,
            'data': data,
            'status': status
        }
        try:
            self.log_collection.insert_one(log_entry)
        except Exception as e:
            logging.error(f"Failed to log transaction: {str(e)}")

    def get_transaction_logs(self, transaction_id):
        return list(self.log_collection.find({'transaction_id': transaction_id}))

class TransactionManager:
    def __init__(self):
        self.logger = TransactionLogger()

    def execute_operations(self, operations):
        """Execute operations with manual rollback capability"""
        transaction_id = str(datetime.utcnow().timestamp())
        rollback_ops = []
        
        try:
            # Log start of transaction
            self.logger.log_transaction(transaction_id, 'start', operations, 'started')
            
            # Execute each operation and store rollback information
            for operation in operations:
                # Store original state for rollback
                if operation['type'] == 'update':
                    original = db[operation['collection']].find_one(operation['filter'])
                    if original:
                        rollback_ops.append({
                            'collection': operation['collection'],
                            'type': 'update',
                            'filter': {'_id': original['_id']},
                            'update': {'$set': original}
                        })
                
                # Execute operation
                self._execute_operation(operation)
                
            # Log successful completion
            self.logger.log_transaction(transaction_id, 'commit', operations, 'completed')
            return True, transaction_id, "Transaction completed successfully"
            
        except Exception as e:
            # Log failure and attempt rollback
            self.logger.log_transaction(transaction_id, 'error', str(e), 'failed')
            
            if rollback_ops:
                self._perform_rollback(rollback_ops, transaction_id)
            
            return False, transaction_id, f"Transaction failed: {str(e)}"

    def _execute_operation(self, operation):
        collection = db[operation['collection']]
        
        if operation['type'] == 'update':
            result = collection.update_one(
                operation['filter'],
                operation['update']
            )
            if not result.modified_count:
                raise OperationFailure(f"Failed to update document in {operation['collection']}")
                
        elif operation['type'] == 'insert':
            collection.insert_one(operation['document'])

    def _perform_rollback(self, rollback_ops, transaction_id):
        """Perform rollback operations"""
        self.logger.log_transaction(transaction_id, 'rollback', rollback_ops, 'started')
        
        try:
            for op in reversed(rollback_ops):
                db[op['collection']].update_one(
                    op['filter'],
                    op['update']
                )
            self.logger.log_transaction(transaction_id, 'rollback', rollback_ops, 'completed')
        except Exception as e:
            self.logger.log_transaction(
                transaction_id,
                'rollback_error',
                str(e),
                'failed'
            )
            logging.error(f"Rollback failed: {str(e)}")