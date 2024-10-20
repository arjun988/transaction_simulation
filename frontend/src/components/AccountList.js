// src/components/AccountList.js
import React, { useEffect, useState } from 'react';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/account_details`);
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          throw new Error('Failed to fetch accounts');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <p className="text-center">Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--error-color)' }}>
        <p style={{ color: 'var(--error-color)' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">All Accounts</h2>
      </div>
      <div className="account-list">
        {accounts.length === 0 ? (
          <p className="text-center">No accounts found</p>
        ) : (
          accounts.map((account) => (
            <div key={account._id} className="account-item">
              <div className="account-info">
                <h3>{account.account_holder}</h3>
                <div className="account-id">ID: {account._id}</div>
              </div>
              <div className="account-balance">
                ${account.balance.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountList;