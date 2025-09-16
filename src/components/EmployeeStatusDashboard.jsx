import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Table from '../components/Table';
import { formatTime } from '../utils/dateUtils';

const EmployeeStatusDashboard = () => {
  const { getAllEmployeeStatuses } = useData();
  const [employeeStatuses, setEmployeeStatuses] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update employee statuses
    setEmployeeStatuses(getAllEmployeeStatuses());

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setEmployeeStatuses(getAllEmployeeStatuses());
    }, 60000);

    return () => clearInterval(timer);
  }, [getAllEmployeeStatuses]);

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'name', header: 'Name' },
    { key: 'department', header: 'Department' },
    { 
      key: 'status', 
      header: 'Today Status',
      render: (status, employee) => (
        <span className={`status ${employee.isCheckedIn ? 'status--active' : 'status--inactive'}`}>
          {employee.isCheckedIn ? 'Checked In' : employee.checkOutTime ? 'Checked Out' : 'Not Present'}
        </span>
      )
    },
    { 
      key: 'checkInTime', 
      header: 'Check In',
      render: (time) => time || '--:--'
    },
    { 
      key: 'checkOutTime', 
      header: 'Check Out',
      render: (time) => time || '--:--'
    },
    { 
      key: 'hoursWorked', 
      header: 'Hours Worked',
      render: (hours) => hours ? `${hours.toFixed(1)}h` : '0h'
    }
  ];

  const stats = {
    totalEmployees: employeeStatuses.length,
    checkedIn: employeeStatuses.filter(emp => emp.isCheckedIn).length,
    checkedOut: employeeStatuses.filter(emp => emp.checkOutTime && !emp.isCheckedIn).length,
    absent: employeeStatuses.filter(emp => !emp.checkInTime).length
  };

  return (
    <div className="employee-status-dashboard">
      <div className="dashboard-header">
        <h2>Real-time Employee Status</h2>
        <div className="current-time">
          {currentTime.toLocaleString()}
        </div>
      </div>

      <div className="stats-grid">
        <Card title="Total Employees">
          <div className="stat-value">{stats.totalEmployees}</div>
        </Card>

        <Card title="Currently Checked In">
          <div className="stat-value stat-value--positive">{stats.checkedIn}</div>
        </Card>

        <Card title="Checked Out Today">
          <div className="stat-value">{stats.checkedOut}</div>
        </Card>

        <Card title="Not Present">
          <div className="stat-value stat-value--negative">{stats.absent}</div>
        </Card>
      </div>

      <Card title="Employee Status Details">
        <Table columns={columns} data={employeeStatuses} />
      </Card>
    </div>
  );
};

export default EmployeeStatusDashboard;