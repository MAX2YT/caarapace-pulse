import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { user } = useAuth();
  const { employees, attendance, leaveRequests } = useData();

  if (user.role === 'hr') {
    const departmentStats = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});

    const attendanceRate = attendance.length > 0 
      ? (attendance.filter(r => r.status === 'Present').length / attendance.length * 100).toFixed(1)
      : 0;

    // Department distribution chart data
    const departmentChartData = {
      labels: Object.keys(departmentStats),
      datasets: [{
        data: Object.values(departmentStats),
        backgroundColor: [
          '#C85A54', '#E6816D', '#B84A44', '#D47068',
          '#A63E38', '#C65E58', '#9B3732', '#B85248'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };

    // Attendance trend chart data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const attendanceCounts = last7Days.map(date => 
      attendance.filter(record => record.date === date && record.status === 'Present').length
    );

    const attendanceChartData = {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{
        label: 'Present Employees',
        data: attendanceCounts,
        borderColor: '#C85A54',
        backgroundColor: 'rgba(200, 90, 84, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    const lineChartOptions = {
      ...chartOptions,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    return (
      <div className="page-container">
        <div className="page-header">
          <h1>HR Analytics</h1>
        </div>

        <div className="stats-grid">
          <Card title="Overall Attendance Rate">
            <div className="stat-value">{attendanceRate}%</div>
          </Card>

          <Card title="Total Departments">
            <div className="stat-value">{Object.keys(departmentStats).length}</div>
          </Card>

          <Card title="Active Employees">
            <div className="stat-value">{employees.filter(emp => emp.status === 'Active').length}</div>
          </Card>

          <Card title="Pending Leaves">
            <div className="stat-value">{leaveRequests.filter(req => req.status === 'Pending').length}</div>
          </Card>
        </div>

        <div className="charts-grid">
          <Card title="Department Distribution">
            <div style={{ height: '300px' }}>
              <Pie data={departmentChartData} options={chartOptions} />
            </div>
          </Card>

          <Card title="Attendance Trend (Last 7 Days)">
            <div style={{ height: '300px' }}>
              <Line data={attendanceChartData} options={lineChartOptions} />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Employee Analytics
  const userAttendance = attendance.filter(record => 
    record.employeeId === user.profile.employeeId
  );

  const presentDays = userAttendance.filter(r => r.status === 'Present').length;
  const totalDays = userAttendance.length;
  const attendancePercentage = totalDays > 0 ? (presentDays / totalDays * 100).toFixed(1) : 0;

  const userLeaves = leaveRequests.filter(req => 
    req.employeeId === user.profile.employeeId
  );

  // Monthly attendance chart for employee
  const monthlyAttendanceData = Array.from({ length: 12 }, (_, i) => {
    const monthAttendance = userAttendance.filter(record => {
      const recordMonth = new Date(record.date).getMonth();
      return recordMonth === i && record.status === 'Present';
    });
    return monthAttendance.length;
  });

  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Days Present',
      data: monthlyAttendanceData,
      backgroundColor: '#C85A54',
      borderColor: '#B84A44',
      borderWidth: 1
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Analytics</h1>
      </div>

      <div className="stats-grid">
        <Card title="My Attendance Rate">
          <div className="stat-value">{attendancePercentage}%</div>
        </Card>

        <Card title="Days Present">
          <div className="stat-value">{presentDays}</div>
        </Card>

        <Card title="Total Leaves Taken">
          <div className="stat-value">{userLeaves.filter(req => req.status === 'Approved').length}</div>
        </Card>

        <Card title="Pending Leave Requests">
          <div className="stat-value">{userLeaves.filter(req => req.status === 'Pending').length}</div>
        </Card>
      </div>

      <Card title="Monthly Attendance">
        <div style={{ height: '400px' }}>
          <Bar data={monthlyChartData} options={barChartOptions} />
        </div>
      </Card>
    </div>
  );
};

export default Analytics;