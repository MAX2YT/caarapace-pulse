// src/utils/storage.js

/**
 * Storage utility functions for Caarapace Pulse Employee Management System
 * Handles localStorage operations for users, employees, attendance, and leave requests
 */

export const STORAGE_KEYS = {
  CURRENT_USER: 'caarapace_current_user',
  USERS: 'caarapace_users',
  EMPLOYEES: 'caarapace_employees',
  ATTENDANCE: 'caarapace_attendance',
  LEAVE_REQUESTS: 'caarapace_leave_requests'
};

// Generic localStorage functions
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clears all stored application data from localStorage
 */
export const clearAllStoredData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// User Authentication Functions
export const getUsers = () => {
  let users = getItem(STORAGE_KEYS.USERS);
  if (!users) {
    users = getSampleUsers();
    setUsers(users);
  }
  return users;
};

export const setUsers = (users) => setItem(STORAGE_KEYS.USERS, users);

export const getCurrentUser = () => getItem(STORAGE_KEYS.CURRENT_USER);

export const setCurrentUser = (user) => setItem(STORAGE_KEYS.CURRENT_USER, user);

export const clearCurrentUser = () => removeItem(STORAGE_KEYS.CURRENT_USER);

// Employee Management Functions
export const getEmployees = () => {
  let employees = getItem(STORAGE_KEYS.EMPLOYEES);
  if (!employees) {
    employees = getSampleEmployees();
    setEmployees(employees);
  }
  return employees;
};

export const setEmployees = (employees) => setItem(STORAGE_KEYS.EMPLOYEES, employees);

// Attendance Functions
export const getAttendance = () => {
  let attendance = getItem(STORAGE_KEYS.ATTENDANCE);
  if (!attendance) {
    attendance = getSampleAttendance();
    setAttendance(attendance);
  }
  return attendance;
};

export const setAttendance = (attendance) => setItem(STORAGE_KEYS.ATTENDANCE, attendance);

// Leave Request Functions
export const getLeaveRequests = () => {
  let leaveRequests = getItem(STORAGE_KEYS.LEAVE_REQUESTS);
  if (!leaveRequests) {
    leaveRequests = getSampleLeaveRequests();
    setLeaveRequests(leaveRequests);
  }
  return leaveRequests;
};

export const setLeaveRequests = (leaveRequests) => setItem(STORAGE_KEYS.LEAVE_REQUESTS, leaveRequests);

// Sample Data Generators
export const getSampleUsers = () => [
  {
    id: 1,
    username: 'john.doe',
    password: 'password123',
    role: 'employee',
    profile: {
      name: 'John Doe',
      employeeId: 'EMP001',
      department: 'Engineering',
      email: 'john.doe@caarapace.com',
      phone: '+1-234-567-8901',
      joinDate: '2023-01-15',
      position: 'Software Engineer'
    }
  },
  {
    id: 2,
    username: 'jane.smith',
    password: 'password123',
    role: 'hr',
    profile: {
      name: 'Jane Smith',
      employeeId: 'HR001',
      department: 'Human Resources',
      email: 'jane.smith@caarapace.com',
      phone: '+1-234-567-8902',
      joinDate: '2022-05-10',
      position: 'HR Manager'
    }
  },
  {
    id: 3,
    username: 'mike.johnson',
    password: 'password123',
    role: 'employee',
    profile: {
      name: 'Mike Johnson',
      employeeId: 'EMP002',
      department: 'Marketing',
      email: 'mike.johnson@caarapace.com',
      phone: '+1-234-567-8903',
      joinDate: '2023-03-20',
      position: 'Marketing Specialist'
    }
  }
];

export const getSampleEmployees = () => [
  {
    id: 1,
    name: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    email: 'john.doe@caarapace.com',
    phone: '+1-234-567-8901',
    position: 'Software Engineer',
    joinDate: '2023-01-15',
    status: 'Active',
    salary: 75000
  },
  {
    id: 2,
    name: 'Jane Smith',
    employeeId: 'HR001',
    department: 'Human Resources',
    email: 'jane.smith@caarapace.com',
    phone: '+1-234-567-8902',
    position: 'HR Manager',
    joinDate: '2022-05-10',
    status: 'Active',
    salary: 85000
  },
  {
    id: 3,
    name: 'Mike Johnson',
    employeeId: 'EMP002',
    department: 'Marketing',
    email: 'mike.johnson@caarapace.com',
    phone: '+1-234-567-8903',
    position: 'Marketing Specialist',
    joinDate: '2023-03-20',
    status: 'Active',
    salary: 65000
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    employeeId: 'EMP003',
    department: 'Finance',
    email: 'sarah.wilson@caarapace.com',
    phone: '+1-234-567-8904',
    position: 'Financial Analyst',
    joinDate: '2023-02-10',
    status: 'Active',
    salary: 70000
  },
  {
    id: 5,
    name: 'David Brown',
    employeeId: 'EMP004',
    department: 'Engineering',
    email: 'david.brown@caarapace.com',
    phone: '+1-234-567-8905',
    position: 'Senior Developer',
    joinDate: '2022-08-15',
    status: 'Active',
    salary: 90000
  },
  {
    id: 6,
    name: 'Lisa Garcia',
    employeeId: 'EMP005',
    department: 'Sales',
    email: 'lisa.garcia@caarapace.com',
    phone: '+1-234-567-8906',
    position: 'Sales Representative',
    joinDate: '2023-04-01',
    status: 'Active',
    salary: 60000
  },
  {
    id: 7,
    name: 'Robert Kim',
    employeeId: 'EMP006',
    department: 'Operations',
    email: 'robert.kim@caarapace.com',
    phone: '+1-234-567-8907',
    position: 'Operations Manager',
    joinDate: '2022-11-20',
    status: 'Active',
    salary: 80000
  }
];

export const getSampleAttendance = () => {
  const attendance = [];
  const employees = ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005', 'EMP006'];
  const today = new Date();
  
  // Generate attendance for last 60 days
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    employees.forEach((empId) => {
      // 92% chance of being present
      const isPresent = Math.random() > 0.08;
      const checkInTime = isPresent ? 
        `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
        null;
      const checkOutTime = isPresent ? 
        `${17 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
        null;
      
      attendance.push({
        id: `${empId}_${dateString}`,
        employeeId: empId,
        date: dateString,
        status: isPresent ? 'Present' : 'Absent',
        checkIn: checkInTime,
        checkOut: checkOutTime,
        hoursWorked: isPresent ? 8 + (Math.random() * 2 - 1) : 0,
        breakTime: isPresent ? 1 : 0
      });
    });
  }
  
  return attendance.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getSampleLeaveRequests = () => [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    leaveType: 'Annual Leave',
    startDate: '2025-09-25',
    endDate: '2025-09-27',
    reason: 'Family vacation',
    status: 'Pending',
    appliedDate: '2025-09-10',
    hrComments: '',
    approvedBy: '',
    approvedDate: ''
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Mike Johnson',
    leaveType: 'Sick Leave',
    startDate: '2025-09-20',
    endDate: '2025-09-22',
    reason: 'Medical appointment and recovery',
    status: 'Approved',
    appliedDate: '2025-09-08',
    hrComments: 'Approved for medical reasons. Please provide medical certificate upon return.',
    approvedBy: 'Jane Smith',
    approvedDate: '2025-09-09'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Sarah Wilson',
    leaveType: 'Personal Leave',
    startDate: '2025-10-01',
    endDate: '2025-10-01',
    reason: 'Personal matters',
    status: 'Rejected',
    appliedDate: '2025-09-05',
    hrComments: 'Unable to approve due to project deadlines. Please reschedule.',
    approvedBy: 'Jane Smith',
    approvedDate: '2025-09-06'
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'David Brown',
    leaveType: 'Annual Leave',
    startDate: '2025-10-15',
    endDate: '2025-10-20',
    reason: 'Wedding anniversary celebration',
    status: 'Pending',
    appliedDate: '2025-09-12',
    hrComments: '',
    approvedBy: '',
    approvedDate: ''
  }
];

// Constants
export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Finance',
  'Sales',
  'Operations',
  'Customer Support',
  'Quality Assurance'
];

export const LEAVE_TYPES = [
  'Annual Leave',
  'Sick Leave',
  'Personal Leave',
  'Maternity/Paternity Leave',
  'Emergency Leave',
  'Bereavement Leave',
  'Study Leave'
];

export const EMPLOYEE_STATUSES = [
  'Active',
  'Inactive',
  'Terminated',
  'On Leave'
];

export const LEAVE_STATUSES = [
  'Pending',
  'Approved',
  'Rejected'
];

// Helper Functions
export const getEmployeeById = (employeeId) => {
  const employees = getEmployees();
  return employees.find(emp => emp.employeeId === employeeId);
};

export const getAttendanceByEmployee = (employeeId) => {
  const attendance = getAttendance();
  return attendance.filter(record => record.employeeId === employeeId);
};

export const getLeaveRequestsByEmployee = (employeeId) => {
  const leaveRequests = getLeaveRequests();
  return leaveRequests.filter(request => request.employeeId === employeeId);
};

export const addEmployee = (employee) => {
  const employees = getEmployees();
  const newEmployee = {
    ...employee,
    id: Math.max(...employees.map(e => e.id), 0) + 1,
    status: employee.status || 'Active'
  };
  employees.push(newEmployee);
  setEmployees(employees);
  return newEmployee;
};

export const updateEmployee = (employeeId, updates) => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.employeeId === employeeId);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates };
    setEmployees(employees);
    return employees[index];
  }
  return null;
};

export const addLeaveRequest = (leaveRequest) => {
  const leaveRequests = getLeaveRequests();
  const newRequest = {
    ...leaveRequest,
    id: Math.max(...leaveRequests.map(r => r.id), 0) + 1,
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0],
    hrComments: '',
    approvedBy: '',
    approvedDate: ''
  };
  leaveRequests.push(newRequest);
  setLeaveRequests(leaveRequests);
  return newRequest;
};

export const updateLeaveRequest = (requestId, updates) => {
  const leaveRequests = getLeaveRequests();
  const index = leaveRequests.findIndex(req => req.id === requestId);
  if (index !== -1) {
    leaveRequests[index] = { ...leaveRequests[index], ...updates };
    setLeaveRequests(leaveRequests);
    return leaveRequests[index];
  }
  return null;
};

export const addAttendanceRecord = (attendanceRecord) => {
  const attendance = getAttendance();
  const newRecord = {
    ...attendanceRecord,
    id: `${attendanceRecord.employeeId}_${attendanceRecord.date}`
  };
  attendance.push(newRecord);
  setAttendance(attendance);
  return newRecord;
};
