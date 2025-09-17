import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { generateMonthlyReport, generateYearlyReport } from '../utils/pdfGenerator';

const Attendance = () => {
  const { user } = useAuth();
  const { attendance } = useData();
  const [userAttendance, setUserAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (user?.profile?.employeeId) {
      const filtered = attendance.filter(record => 
        record.employeeId === user.profile.employeeId
      );
      // Sort by date descending (newest first)
      const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUserAttendance(sorted);
    }
  }, [user, attendance]);

  const handleDownloadMonthlyPDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      // Filter attendance for selected month and year
      const monthlyData = userAttendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === selectedMonth && 
               recordDate.getFullYear() === selectedYear;
      });

      console.log('Generating monthly PDF for:', monthNames[selectedMonth], selectedYear);
      console.log('Data:', monthlyData);

      const result = generateMonthlyReport(
        monthlyData, 
        monthNames[selectedMonth], 
        selectedYear, 
        user
      );

      if (result.success) {
        console.log('Monthly PDF generated successfully:', result.filename);
        // Show success message briefly
        setTimeout(() => {
          alert('Monthly report downloaded successfully!');
        }, 100);
      } else {
        console.error('PDF generation failed:', result.error);
        alert(`Error generating PDF: ${result.error}`);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadYearlyPDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    try {
      // Filter attendance for selected year
      const yearlyData = userAttendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === selectedYear;
      });

      console.log('Generating yearly PDF for:', selectedYear);
      console.log('Data:', yearlyData);

      const result = generateYearlyReport(yearlyData, selectedYear, user);

      if (result.success) {
        console.log('Yearly PDF generated successfully:', result.filename);
        // Show success message briefly
        setTimeout(() => {
          alert('Yearly report downloaded successfully!');
        }, 100);
      } else {
        console.error('PDF generation failed:', result.error);
        alert(`Error generating PDF: ${result.error}`);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Calculate statistics for current filtered data
  const filteredData = userAttendance.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth && 
           recordDate.getFullYear() === selectedYear;
  });

  const stats = {
    totalDays: filteredData.length,
    presentDays: filteredData.filter(record => record.status === 'Present').length,
    absentDays: filteredData.filter(record => record.status === 'Absent').length,
    totalHours: filteredData.reduce((sum, record) => sum + (record.hoursWorked || 0), 0)
  };

  const attendanceRate = stats.totalDays > 0 
    ? ((stats.presentDays / stats.totalDays) * 100).toFixed(1) 
    : 0;

  // Table columns
  const columns = [
    { 
      key: 'date', 
      header: 'Date', 
      render: (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => (
        <span className={`status status--${status?.toLowerCase() || 'absent'}`}>
          {status || 'Absent'}
        </span>
      )
    },
    { key: 'checkIn', header: 'Check In', render: (time) => time || '--:--' },
    { key: 'checkOut', header: 'Check Out', render: (time) => time || '--:--' },
    { 
      key: 'hoursWorked', 
      header: 'Hours Worked',
      render: (hours) => hours ? `${hours.toFixed(1)}h` : '0.0h'
    }
  ];

  // Get months for dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get years for dropdown (current year and previous 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1>My Attendance</h1>
            <p>Track your attendance records and generate reports</p>
          </div>
          <div className="header-actions">
            <Button 
              variant="primary" 
              onClick={handleDownloadMonthlyPDF}
              disabled={isGeneratingPDF}
              className="download-btn"
            >
              {isGeneratingPDF ? 'Generating...' : 'Download Monthly Report'}
            </Button>

            <Button 
              variant="secondary" 
              onClick={handleDownloadYearlyPDF}
              disabled={isGeneratingPDF}
              className="download-btn"
            >
              {isGeneratingPDF ? 'Generating...' : 'Download Yearly Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <Card title="Filter & Generate Reports">
        <div className="attendance-controls">
          <div className="date-filters">
            <div className="form-group">
              <label className="form-label">Month</label>
              <select 
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <select 
                className="form-control"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-info">
            <p>Select month and year to filter records and generate reports</p>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <Card title="Total Days">
          <div className="stat-value">{stats.totalDays}</div>
        </Card>

        <Card title="Present Days">
          <div className="stat-value stat-value--positive">{stats.presentDays}</div>
        </Card>

        <Card title="Absent Days">
          <div className="stat-value stat-value--negative">{stats.absentDays}</div>
        </Card>

        <Card title="Total Hours">
          <div className="stat-value">{stats.totalHours.toFixed(1)}h</div>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card title="Attendance Records">
        {filteredData.length > 0 ? (
          <>
            <Table columns={columns} data={filteredData} />
            <div className="table-footer">
              <p>Showing {filteredData.length} records for {months[selectedMonth]} {selectedYear}</p>
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>No attendance records found for {months[selectedMonth]} {selectedYear}</p>
            <p>Try selecting a different month or year.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Attendance;