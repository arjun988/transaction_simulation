import React, { useEffect, useState } from 'react';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/account_details`);
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error('Failed to fetch accounts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div>
      <h2>All Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        <ul>
          {accounts.map((account) => (
            <li key={account._id}>
              <strong>{account.account_holder}</strong>: ${account.balance.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccountList;
