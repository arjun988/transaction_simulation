import React, { useState } from 'react';

const TransferForm = () => {
  const [senderId, setSenderId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');

  const transferMoney = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender_id: senderId,
        recipient_id: recipientId,
        amount: parseFloat(amount),
      }),
    });

    const data = await response.json();
    alert(data.message || 'Transfer successful!');
  };

  return (
    <form onSubmit={transferMoney}>
      <h2>Transfer Money</h2>
      <input
        type="text"
        placeholder="Sender Account ID"
        value={senderId}
        onChange={(e) => setSenderId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Recipient Account ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit">Transfer</button>
    </form>
  );
};

export default TransferForm;
