import React from 'react';
import AccountForm from './components/AccountForm';
import TransferForm from './components/TransferForm';
import AccountList from './components/AccountList';

const App = () => {
  return (
    <div>
      <h1>Transaction Simulation Project</h1>
      <AccountForm />
      <TransferForm />
      <AccountList />
    </div>
  );
};

export default App;
