import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AccountForm from './components/AccountForm';
import TransferForm from './components/TransferForm';
import AccountList from './components/AccountList';
import AdminAuditPanel from './components/AdminAuditPanel';
import { BarChart3, Wallet, ArrowLeftRight, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [activeAccounts, setActiveAccounts] = useState(0);
  const [pendingTransfers, setPendingTransfers] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch account details
        const accountsResponse = await fetch('http://localhost:5000/account_details');
        if (accountsResponse.ok) {
          const accounts = await accountsResponse.json();
          const total = accounts.reduce((sum, account) => sum + account.balance, 0);
          setTotalBalance(total);
          setActiveAccounts(accounts.length);
        }

        // Fetch pending transfers count
        const pendingResponse = await fetch('http://localhost:5000/admin/pending_transfers');
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          setPendingTransfers(pendingData.length);
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
          <BarChart3 size={24} className="text-blue-500" />
          <h3>Total Balance</h3>
          <div className="stat-value">${totalBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</div>
          <p>Across all accounts</p>
        </div>
        <div className="stat-card">
          <Wallet size={24} className="text-green-500" />
          <h3>Active Accounts</h3>
          <div className="stat-value">{activeAccounts}</div>
          <p>Currently managed</p>
        </div>
        <div className="stat-card">
          <AlertTriangle size={24} className="text-yellow-500" />
          <h3>Pending Reviews</h3>
          <div className="stat-value">{pendingTransfers}</div>
          <p>Transfers awaiting approval</p>
        </div>
      </div>
      <div className="mt-6">
        <AdminAuditPanel />
      </div>
      <div className="mt-6">
        <AccountList />
      </div>
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
  return (
    <>
      <TransferForm />
      <div className="mt-6">
        <AdminAuditPanel />
      </div>
    </>
  );
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
    console.log('Admin logged out');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const togglePermissions = () => {
    setPermissions(!permissions);
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
      <button 
        className="button"
        onClick={handleLogout}
      >
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