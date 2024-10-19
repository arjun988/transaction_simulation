import React, { useState } from 'react';

const AccountForm = () => {
  const [accountId, setAccountId] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [balance, setBalance] = useState('');

  const createAccount = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`http://localhost:5000/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: accountId,
        account_holder: accountHolder,
        balance: parseFloat(balance),
      }),
    });

    const data = await response.json();
    alert(data.message || 'Account created successfully!');
  };

  return (
    <form onSubmit={createAccount}>
      <h2>Create New Account</h2>
      <input
        type="text"
        placeholder="Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Account Holder"
        value={accountHolder}
        onChange={(e) => setAccountHolder(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Initial Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        required
      />
      <button type="submit">Create Account</button>
    </form>
  );
};

export default AccountForm;
