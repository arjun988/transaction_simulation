import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';

const AdminAuditPanel = () => {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingTransfers = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/pending_transfers');
      const data = await response.json();
      setPendingTransfers(data);
    } catch (error) {
      console.error('Error fetching pending transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTransfers();
  }, []);

  const handleApprove = async (transactionId) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/approve_transfer/${transactionId}`, {
        method: 'POST'
      });
      if (response.ok) {
        await fetchPendingTransfers();
      }
    } catch (error) {
      console.error('Error approving transfer:', error);
    }
  };

  if (loading) {
    return <div className="card">Loading pending transfers...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Shield className="mr-2" size={20} />
          Pending Transfer Approvals
        </h2>
      </div>
      
      {pendingTransfers.length === 0 ? (
        <p className="text-center p-4">No pending transfers requiring review</p>
      ) : (
        <div className="transfer-list">
          {pendingTransfers.map((transfer) => (
            <div key={transfer.transaction_id} className="transfer-item p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h4>Transaction ID: {transfer.transaction_id}</h4>
                  <p>From: {transfer.sender_id}</p>
                  <p>To: {transfer.recipient_id}</p>
                  <p>Amount: ${transfer.amount.toFixed(2)}</p>
                  <p>Justification: {transfer.justification}</p>
                  
                  {transfer.flags.length > 0 && (
                    <div className="mt-2">
                      <h5>Flags:</h5>
                      <ul className="list-disc ml-4">
                        {transfer.flags.map((flag, index) => (
                          <li key={index} className="text-red-500">
                            {flag.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(transfer.transaction_id)}
                    className="button button-success"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button className="button button-danger">
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAuditPanel;