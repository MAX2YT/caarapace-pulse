import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const employeeMenuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/attendance', icon: '📅', label: 'Attendance' },
    { path: '/leave-request', icon: '📝', label: 'Leave Request' },
    { path: '/analytics', icon: '📊', label: 'Analytics' }
  ];

  const hrMenuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/employees', icon: '👥', label: 'Employees' },
    { path: '/leave-management', icon: '📋', label: 'Leave Management' },
    { path: '/analytics', icon: '📊', label: 'Analytics' }
  ];

  const menuItems = user?.role === 'hr' ? hrMenuItems : employeeMenuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🦀</span>
          <span className="logo-text">Caarapace</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.profile?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.profile?.name}</div>
            <div className="user-role">{user?.role === 'hr' ? 'HR' : 'Employee'}</div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;