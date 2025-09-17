import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  // Navigation definitions – HR sees Employees, Leave-Management etc.
  const menu = user?.role === 'hr'
    ? [
        { path: '/dashboard',  icon: '🏠', label: 'Dashboard' },
        { path: '/employees',  icon: '👥', label: 'Employees' },      // ← buttons live here
        { path: '/leave-management', icon: '📋', label: 'Leave Management' },
        { path: '/analytics',  icon: '📊', label: 'Analytics' }
      ]
    : [
        { path: '/dashboard',  icon: '🏠', label: 'Dashboard' },
        { path: '/profile',    icon: '👤', label: 'Profile' },
        { path: '/attendance', icon: '📅', label: 'Attendance' },
        { path: '/leave-request', icon: '📝', label: 'Leave Request' },
        { path: '/analytics',  icon: '📊', label: 'Analytics' }
      ];

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <span className="logo-icon">🦀</span>
        <span className="logo-text">Caarapace</span>
      </header>

      <nav className="sidebar-nav">
        {menu.map(({ path, icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${pathname === path ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </Link>
        ))}
      </nav>

      <footer className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;
