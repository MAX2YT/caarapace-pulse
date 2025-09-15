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
        
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.profile?.name || 'User'}</span>
              <span className="user-role">
                {user?.role === 'hr' ? 'Human Resources' : 'Employee'} • {user?.profile?.employeeId}
              </span>
            </div>
          </div>
          
          <div className="header-divider"></div>
          
          <Button variant="outline" onClick={handleLogout} className="logout-btn">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;