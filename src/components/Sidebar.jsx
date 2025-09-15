import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const employeeMenuItems = [
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/attendance', label: 'Attendance', icon: '📅' },
    { path: '/leave-request', label: 'Leave Request', icon: '📝' },
    { path: '/analytics', label: 'Analytics', icon: '📊' }
  ];

  const hrMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/employees', label: 'Employees', icon: '👥' },
    { path: '/leave-management', label: 'Leave Management', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📊' }
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
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;