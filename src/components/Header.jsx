import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Welcome to Caarapace Pulse</h1>
          <p className="header-subtitle">
            {user?.role === 'hr' ? 'HR Dashboard' : 'Employee Portal'}
          </p>
        </div>
        
       
        </div>
    </header>
  );
};

export default Header;