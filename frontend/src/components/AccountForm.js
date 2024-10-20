// src/components/AccountForm.js
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const AccountForm = () => {
  const [accountId, setAccountId] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);

  const createAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: accountId,
          account_holder: accountHolder,
          balance: parseFloat(balance),
        }),
      });

      const data = await response.json();
      alert(data.message || 'Account created successfully!');
      
      // Clear form
      setAccountId('');
      setAccountHolder('');
      setBalance('');
    } catch (error) {
      alert('Error creating account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create New Account</h2>
      </div>
      <form onSubmit={createAccount}>
        <div className="form-group">
          <label className="form-label">Account ID</label>
          <input
            type="text"
            className="form-input"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Account Holder</label>
          <input
            type="text"
            className="form-input"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Initial Balance</label>
          <input
            type="number"
            className="form-input"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            required
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          <PlusCircle size={20} />
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default AccountForm;