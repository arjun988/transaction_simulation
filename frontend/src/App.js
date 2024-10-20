import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AccountForm from './components/AccountForm';
import TransferForm from './components/TransferForm';
import AccountList from './components/AccountList';
import { BarChart3, Wallet, ArrowLeftRight } from 'lucide-react';

const Dashboard = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [activeAccounts, setActiveAccounts] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/account_details');
        if (response.ok) {
          const accounts = await response.json();
          // Calculate total balance
          const total = accounts.reduce((sum, account) => sum + account.balance, 0);
          setTotalBalance(total);
          // Set number of active accounts
          setActiveAccounts(accounts.length);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="dashboard-grid">
        <div className="stat-card">
          <BarChart3 size={24} color="var(--primary-color)" />
          <h3>Total Balance</h3>
          <div className="stat-value">${totalBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</div>
          <p>Across all accounts</p>
        </div>
        <div className="stat-card">
          <Wallet size={24} color="var(--secondary-color)" />
          <h3>Active Accounts</h3>
          <div className="stat-value">{activeAccounts}</div>
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
  const [darkMode, setDarkMode] = useState(false);
  const [permissions, setPermissions] = useState(false);

  const handleLogout = () => {
    // Logic to handle admin logout (e.g., clear session, redirect)
    console.log('Admin logged out');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You might want to save the preference in local storage or context
  };

  const togglePermissions = () => {
    setPermissions(!permissions);
    // Logic to handle permission changes
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Account Settings</h2>
      </div>
      <div className="form-group">
        <label className="form-label">
          <input 
            type="checkbox" 
            checked={darkMode} 
            onChange={toggleDarkMode} 
          /> 
          Dark Mode
        </label>
      </div>
      <div className="form-group">
        <label className="form-label">
          <input 
            type="checkbox" 
            checked={permissions} 
            onChange={togglePermissions} 
          /> 
          Permission Only
        </label>
      </div>
      <button className="button" onClick={handleLogout}>
        Logout
      </button>
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