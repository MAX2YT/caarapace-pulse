import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const { employees, leaveRequests } = useData();

  const stats = {
    totalEmployees: 1234,
    employeeGrowth: 7.1,
    openPositions: 37,
    pendingLeaves: leaveRequests.filter(req => req.status === 'Pending').length
  };

  if (user.role === 'employee') {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Welcome back, {user.profile.name}!</h1>
          <p>Employee Dashboard</p>
        </div>
        
        <div className="stats-grid">
          <Card title="My Department">
            <div className="stat-value">{user.profile.department}</div>
          </Card>
          
          <Card title="My Position">
            <div className="stat-value">{user.profile.position}</div>
          </Card>
          
          <Card title="Employee ID">
            <div className="stat-value">{user.profile.employeeId}</div>
          </Card>
          
          <Card title="Join Date">
            <div className="stat-value">{new Date(user.profile.joinDate).toLocaleDateString()}</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome to Caarapace Pulse</h1>
        <p>HR Dashboard</p>
      </div>
      
      <div className="stats-grid">
        <Card title="Total Employees">
          <div className="stat-value">{stats.totalEmployees.toLocaleString()}</div>
        </Card>
        
        <Card title="Employee Growth">
          <div className="stat-value stat-value--positive">
            {stats.employeeGrowth}%
            <div className="growth-indicator">📈</div>
          </div>
        </Card>
        
        <Card title="Open Positions">
          <div className="stat-value">{stats.openPositions}</div>
        </Card>
        
        <Card title="Pending Leaves">
          <div className="stat-value">{stats.pendingLeaves}</div>
        </Card>
      </div>
      
      <div className="dashboard-actions">
        <Card title="Quick Actions">
          <div className="action-buttons">
            <button className="action-btn">Add Employee</button>
            <button className="action-btn">Review Leaves</button>
            <button className="action-btn">Generate Report</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;