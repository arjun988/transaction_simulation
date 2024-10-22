import React, { useState } from 'react';
import { ArrowLeftRight, AlertTriangle } from 'lucide-react';

const TransferForm = () => {
  const [senderId, setSenderId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false);
  const [flags, setFlags] = useState([]);

  const transferMoney = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFlags([]);

    try {
      const response = await fetch('http://localhost:5000/transfer_with_justification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: senderId,
          recipient_id: recipientId,
          amount: parseFloat(amount),
          justification
        }),
      });

      const data = await response.json();
      
      if (response.status === 202) {
        // Transaction requires review
        setFlags(data.flags);
        alert('Transaction requires admin review due to suspicious activity');
      } else if (response.ok) {
        alert(data.message || 'Transfer successful!');
        // Clear form
        setSenderId('');
        setRecipientId('');
        setAmount('');
        setJustification('');
      } else {
        throw new Error(data.error || 'Transfer failed');
      }
    } catch (error) {
      alert('Error during transfer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Transfer Money</h2>
      </div>
      
      {flags.length > 0 && (
        <div className="alert alert-warning">
          <AlertTriangle className="mr-2" size={20} />
          <div>
            <h4>Transaction Flagged for Review</h4>
            <ul>
              {flags.map((flag, index) => (
                <li key={index}>{flag.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <form onSubmit={transferMoney}>
        <div className="form-group">
          <label className="form-label">Sender Account ID</label>
          <input
            type="text"
            className="form-input"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Recipient Account ID</label>
          <input
            type="text"
            className="form-input"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Transfer Justification</label>
          <textarea
            className="form-input"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            required
            disabled={loading}
            placeholder="Please provide a reason for this transfer..."
            rows={3}
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          <ArrowLeftRight size={20} />
          {loading ? 'Processing...' : 'Transfer Money'}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;