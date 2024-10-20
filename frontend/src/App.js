import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AccountForm from './components/AccountForm';
import TransferForm from './components/TransferForm';
import AccountList from './components/AccountList';
import { BarChart3, Wallet, ArrowLeftRight } from 'lucide-react';

// Dashboard component
const Dashboard = () => {
  return (
    <>
      <div className="dashboard-grid">
        <div className="stat-card">
          <BarChart3 size={24} color="var(--primary-color)" />
          <h3>Total Balance</h3>
          <div className="stat-value">$24,500.00</div>
          <p>Across all accounts</p>
        </div>
        <div className="stat-card">
          <Wallet size={24} color="var(--secondary-color)" />
          <h3>Active Accounts</h3>
          <div className="stat-value">12</div>
          <p>Currently managed</p>
        </div>
        <div className="stat-card">
          <ArrowLeftRight size={24} color="var(--success-color)" />
          <h3>Recent Transfers</h3>
          <div className="stat-value">28</div>
          <p>Last 30 days</p>
        </div>
      </div>
      <AccountList />
    </>
  );
};

// Accounts page component
const AccountsPage = () => {
  return (
    <>
      <AccountForm />
      <AccountList />
    </>
  );
};

// Transfer page component
const TransferPage = () => {
  return <TransferForm />;
};

// History page component
const HistoryPage = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Transaction History</h2>
      </div>
      <p className="text-center">Transaction history will be implemented here</p>
    </div>
  );
};

// Settings page component
const SettingsPage = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Account Settings</h2>
      </div>
      <p className="text-center">Settings will be implemented here</p>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;