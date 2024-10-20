// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ArrowLeftRight, History, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/accounts', label: 'Accounts', icon: <Users size={20} /> },
    { path: '/transfer', label: 'Transfer', icon: <ArrowLeftRight size={20} /> },
    { path: '/history', label: 'History', icon: <History size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">Banking App</div>
      <ul className="nav-links">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;