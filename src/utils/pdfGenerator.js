import { jsPDF } from 'jspdf';

/**
 * Generate PDF report for attendance data
 * @param {Array} attendanceData - Array of attendance records
 * @param {string} reportType - 'monthly' or 'yearly'
 * @param {string} period - Period string (e.g., 'September 2025' or '2025')
 * @param {Object} user - Current user object
 */
export const generateAttendancePDF = (attendanceData, reportType = 'monthly', period = '', user = null) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();

    // Set up document properties
    doc.setProperties({
      title: `Attendance Report - ${period}`,
      subject: `${reportType} Attendance Report`,
      author: 'Caarapace Pulse',
      creator: 'Caarapace Pulse Employee Management System'
    });

    // Add company header
    addCompanyHeader(doc);

    // Add report title
    const reportTitle = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(reportTitle, 105, 50, { align: 'center' });

    // Add period
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${period}`, 105, 60, { align: 'center' });

    // Add user info if available
    let currentY = 75;
    if (user && user.profile) {
      doc.setFontSize(12);
      doc.text(`Employee: ${user.profile.name} (${user.profile.employeeId})`, 20, currentY);
      doc.text(`Department: ${user.profile.department}`, 20, currentY + 8);
      currentY += 25;
    }

    // Add attendance table manually
    if (attendanceData && attendanceData.length > 0) {
      currentY = addAttendanceTable(doc, attendanceData, currentY);
    } else {
      doc.setFontSize(12);
      doc.text('No attendance records found for this period.', 20, currentY);
      currentY += 20;
    }

    // Add summary statistics
    addSummaryStats(doc, attendanceData, currentY + 10);

    // Add footer
    addFooter(doc);

    // Generate filename
    const filename = generateFilename(reportType, period, user);

    // Save the PDF
    doc.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add company header to PDF
 */
const addCompanyHeader = (doc) => {
  // Add company logo (crab emoji as text)
  doc.setFontSize(24);
  doc.text('🦀', 20, 25);

  // Add company name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 90, 84); // Caarapace primary color
  doc.text('Caarapace Pulse', 35, 25);

  // Add subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // Gray color
  doc.text('Employee Management System', 35, 32);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.line(20, 38, 190, 38);
};

/**
 * Add attendance table manually without autotable
 */
const addAttendanceTable = (doc, attendanceData, startY) => {
  const tableHeaders = ['Date', 'Status', 'Check In', 'Check Out', 'Hours Worked'];
  const colWidths = [35, 25, 25, 25, 30];
  const colPositions = [20, 55, 80, 105, 130];

  let currentY = startY;

  // Add table header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(200, 90, 84); // Caarapace primary color
  doc.setTextColor(255, 255, 255);

  // Draw header background
  doc.rect(20, currentY - 5, 150, 8, 'F');

  // Add header text
  tableHeaders.forEach((header, index) => {
    doc.text(header, colPositions[index], currentY);
  });

  currentY += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Add table rows
  attendanceData.slice(0, 30).forEach((record, index) => {
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, currentY - 4, 150, 7, 'F');
    }

    // Add row data
    const rowData = [
      formatDate(record.date),
      record.status || 'N/A',
      record.checkIn || '--:--',
      record.checkOut || '--:--',
      record.hoursWorked ? `${record.hoursWorked.toFixed(1)}h` : '0.0h'
    ];

    rowData.forEach((data, colIndex) => {
      doc.text(data.toString(), colPositions[colIndex], currentY);
    });

    currentY += 7;

    // Check if we need a new page
    if (currentY > 260) {
      doc.addPage();
      currentY = 30;
    }
  });

  // Add note if data is truncated
  if (attendanceData.length > 30) {
    currentY += 5;
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(`Note: Showing first 30 records of ${attendanceData.length} total records.`, 20, currentY);
    doc.setTextColor(0, 0, 0);
    currentY += 10;
  }

  return currentY;
};

/**
 * Add summary statistics to PDF
 */
const addSummaryStats = (doc, attendanceData, startY) => {
  if (!attendanceData || attendanceData.length === 0) return;

  // Calculate statistics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(record => record.status === 'Present').length;
  const absentDays = totalDays - presentDays;
  const totalHours = attendanceData.reduce((sum, record) => sum + (record.hoursWorked || 0), 0);
  const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  // Check if we need a new page
  if (startY > 240) {
    doc.addPage();
    startY = 30;
  }

  // Add summary section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, startY);

  // Add summary box
  doc.setFillColor(248, 250, 252);
  doc.rect(20, startY + 5, 150, 25, 'F');
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 90, 84);
  doc.rect(20, startY + 5, 150, 25);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const summaryY = startY + 15;
  doc.text(`Total Days: ${totalDays}`, 30, summaryY);
  doc.text(`Present Days: ${presentDays}`, 100, summaryY);

  doc.text(`Absent Days: ${absentDays}`, 30, summaryY + 8);
  doc.text(`Attendance Rate: ${attendanceRate}%`, 100, summaryY + 8);

  doc.text(`Total Hours Worked: ${totalHours.toFixed(1)} hours`, 30, summaryY + 16);
};

/**
 * Add footer to PDF
 */
const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Add generation timestamp
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on: ${timestamp}`, 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 170, 285);

    // Add company info
    doc.text('Caarapace Pulse - Confidential', 105, 285, { align: 'center' });
  }
};

/**
 * Generate filename for PDF
 */
const generateFilename = (reportType, period, user) => {
  const sanitizedPeriod = period.replace(/[^a-zA-Z0-9]/g, '_');
  const userPart = user ? `_${user.profile.employeeId}` : '';
  return `${reportType}_attendance_report_${sanitizedPeriod}${userPart}.pdf`;
};

/**
 * Format date string for display
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Generate monthly attendance report
 */
export const generateMonthlyReport = (attendanceData, month, year, user) => {
  const period = `${month} ${year}`;
  return generateAttendancePDF(attendanceData, 'monthly', period, user);
};

/**
 * Generate yearly attendance report
 */
export const generateYearlyReport = (attendanceData, year, user) => {
  const period = year.toString();
  return generateAttendancePDF(attendanceData, 'yearly', period, user);
};

/**
 * Generate custom date range report
 */
export const generateCustomReport = (attendanceData, startDate, endDate, user) => {
  const period = `${formatDate(startDate)} to ${formatDate(endDate)}`;
  return generateAttendancePDF(attendanceData, 'custom', period, user);
};