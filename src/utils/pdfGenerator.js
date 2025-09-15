export const generateAttendancePDF = (attendanceData, employeeProfile, reportType = 'monthly') => {
  if (typeof jsPDF === 'undefined') {
    console.error('jsPDF library not loaded');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Company header
  doc.setFontSize(20);
  doc.setTextColor(200, 90, 84); // Caarapace red color
  doc.text('🦀 Caarapace', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Employee Management System', 20, 30);
  
  // Report title
  doc.setFontSize(14);
  doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`, 20, 45);
  
  // Employee details
  doc.setFontSize(12);
  doc.text(`Employee Name: ${employeeProfile.name}`, 20, 60);
  doc.text(`Employee ID: ${employeeProfile.employeeId}`, 20, 70);
  doc.text(`Department: ${employeeProfile.department}`, 20, 80);
  doc.text(`Position: ${employeeProfile.position}`, 20, 90);
  
  // Report generation date
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 100);
  
  // Attendance summary
  const presentDays = attendanceData.filter(record => record.status === 'Present').length;
  const absentDays = attendanceData.filter(record => record.status === 'Absent').length;
  const totalHours = attendanceData.reduce((sum, record) => sum + (record.hoursWorked || 0), 0);
  
  doc.text('Attendance Summary:', 20, 120);
  doc.text(`Total Days: ${attendanceData.length}`, 30, 130);
  doc.text(`Present Days: ${presentDays}`, 30, 140);
  doc.text(`Absent Days: ${absentDays}`, 30, 150);
  doc.text(`Total Hours Worked: ${totalHours}`, 30, 160);
  doc.text(`Attendance Rate: ${attendanceData.length > 0 ? (presentDays / attendanceData.length * 100).toFixed(1) : 0}%`, 30, 170);
  
  // Attendance details table
  if (attendanceData.length > 0) {
    doc.text('Attendance Details:', 20, 190);
    
    // Table headers
    const startY = 200;
    doc.text('Date', 20, startY);
    doc.text('Status', 60, startY);
    doc.text('Check In', 100, startY);
    doc.text('Check Out', 140, startY);
    doc.text('Hours', 180, startY);
    
    // Table data
    attendanceData.slice(0, 20).forEach((record, index) => {
      const y = startY + 10 + (index * 10);
      doc.text(new Date(record.date).toLocaleDateString(), 20, y);
      doc.text(record.status, 60, y);
      doc.text(record.checkIn || '-', 100, y);
      doc.text(record.checkOut || '-', 140, y);
      doc.text((record.hoursWorked || 0).toString(), 180, y);
    });
    
    if (attendanceData.length > 20) {
      doc.text(`... and ${attendanceData.length - 20} more records`, 20, startY + 220);
    }
  }
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('This is an automatically generated report from Caarapace Pulse Employee Management System.', 20, 280);
  
  // Save the PDF
  const filename = `${employeeProfile.employeeId}_${reportType}_attendance_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

export const generateEmployeeReportPDF = (employee) => {
  if (typeof jsPDF === 'undefined') {
    console.error('jsPDF library not loaded');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Company header
  doc.setFontSize(20);
  doc.setTextColor(200, 90, 84);
  doc.text('🦀 Caarapace', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Employee Management System', 20, 30);
  
  // Report title
  doc.setFontSize(14);
  doc.text('Employee Information Report', 20, 45);
  
  // Employee details
  doc.setFontSize(12);
  const details = [
    `Employee Name: ${employee.name}`,
    `Employee ID: ${employee.employeeId}`,
    `Department: ${employee.department}`,
    `Position: ${employee.position}`,
    `Email: ${employee.email}`,
    `Phone: ${employee.phone}`,
    `Join Date: ${new Date(employee.joinDate).toLocaleDateString()}`,
    `Status: ${employee.status}`,
    `Salary: $${employee.salary?.toLocaleString() || 'N/A'}`
  ];
  
  details.forEach((detail, index) => {
    doc.text(detail, 20, 65 + (index * 10));
  });
  
  // Report generation date
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 170);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('This is an automatically generated report from Caarapace Pulse Employee Management System.', 20, 280);
  
  // Save the PDF
  const filename = `${employee.employeeId}_employee_report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

export const generateLeaveRequestPDF = (leaveRequest, employeeProfile) => {
  if (typeof jsPDF === 'undefined') {
    console.error('jsPDF library not loaded');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Company header
  doc.setFontSize(20);
  doc.setTextColor(200, 90, 84);
  doc.text('🦀 Caarapace', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Employee Management System', 20, 30);
  
  // Form title
  doc.setFontSize(14);
  doc.text('Leave Request Form', 20, 45);
  
  // Employee details
  doc.setFontSize(12);
  doc.text(`Employee Name: ${employeeProfile.name}`, 20, 65);
  doc.text(`Employee ID: ${employeeProfile.employeeId}`, 20, 75);
  doc.text(`Department: ${employeeProfile.department}`, 20, 85);
  
  // Leave request details
  doc.text('Leave Request Details:', 20, 105);
  doc.text(`Leave Type: ${leaveRequest.leaveType}`, 30, 115);
  doc.text(`Start Date: ${new Date(leaveRequest.startDate).toLocaleDateString()}`, 30, 125);
  doc.text(`End Date: ${new Date(leaveRequest.endDate).toLocaleDateString()}`, 30, 135);
  doc.text(`Applied Date: ${new Date(leaveRequest.appliedDate).toLocaleDateString()}`, 30, 145);
  doc.text(`Status: ${leaveRequest.status}`, 30, 155);
  
  // Reason
  doc.text('Reason:', 30, 175);
  const splitReason = doc.splitTextToSize(leaveRequest.reason, 160);
  doc.text(splitReason, 30, 185);
  
  // HR Comments if available
  if (leaveRequest.hrComments) {
    doc.text('HR Comments:', 30, 205);
    const splitComments = doc.splitTextToSize(leaveRequest.hrComments, 160);
    doc.text(splitComments, 30, 215);
  }
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('This is an automatically generated document from Caarapace Pulse Employee Management System.', 20, 280);
  
  // Save the PDF
  const filename = `${employeeProfile.employeeId}_leave_request_${leaveRequest.id}.pdf`;
  doc.save(filename);
};