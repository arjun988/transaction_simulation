// src/components/TransferForm.js
import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

const TransferForm = () => {
  const [senderId, setSenderId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const transferMoney = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: senderId,
          recipient_id: recipientId,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      alert(data.message || 'Transfer successful!');
      
      // Clear form
      setSenderId('');
      setRecipientId('');
      setAmount('');
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
        <button type="submit" className="button" disabled={loading}>
          <ArrowLeftRight size={20} />
          {loading ? 'Processing...' : 'Transfer Money'}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;