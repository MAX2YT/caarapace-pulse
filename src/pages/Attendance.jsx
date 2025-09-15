import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { generateAttendancePDF } from '../utils/pdfGenerator';
import { formatDate } from '../utils/dateUtils';

const Attendance = () => {
  const { user } = useAuth();
  const { attendance } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const userAttendance = attendance.filter(record => 
    record.employeeId === user.profile.employeeId
  );

  const filteredAttendance = userAttendance.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth && 
           recordDate.getFullYear() === selectedYear;
  });

  const columns = [
    { key: 'date', header: 'Date', render: (date) => formatDate(date) },
    { key: 'status', header: 'Status' },
    { key: 'checkIn', header: 'Check In' },
    { key: 'checkOut', header: 'Check Out' },
    { key: 'hoursWorked', header: 'Hours Worked' }
  ];

  const handleDownloadPDF = (type) => {
    const data = type === 'monthly' ? filteredAttendance : userAttendance;
    generateAttendancePDF(data, user.profile, type);
  };

  const attendanceStats = {
    totalDays: filteredAttendance.length,
    presentDays: filteredAttendance.filter(r => r.status === 'Present').length,
    absentDays: filteredAttendance.filter(r => r.status === 'Absent').length,
    totalHours: filteredAttendance.reduce((sum, r) => sum + r.hoursWorked, 0)
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Attendance</h1>
        <div className="header-actions">
          <Button variant="primary" onClick={() => handleDownloadPDF('monthly')}>
            Download Monthly Report
          </Button>
          <Button variant="secondary" onClick={() => handleDownloadPDF('yearly')}>
            Download Yearly Report
          </Button>
        </div>
      </div>

      <div className="attendance-controls">
        <div className="date-filters">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="form-control"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2023, i, 1).toLocaleDateString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="form-control"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <Card title="Total Days">
          <div className="stat-value">{attendanceStats.totalDays}</div>
        </Card>
        
        <Card title="Present Days">
          <div className="stat-value stat-value--positive">{attendanceStats.presentDays}</div>
        </Card>
        
        <Card title="Absent Days">
          <div className="stat-value stat-value--negative">{attendanceStats.absentDays}</div>
        </Card>
        
        <Card title="Total Hours">
          <div className="stat-value">{attendanceStats.totalHours}</div>
        </Card>
      </div>

      <Card title="Attendance Records">
        <Table columns={columns} data={filteredAttendance} />
      </Card>
    </div>
  );
};

export default Attendance;