// src/utils/storage.js

/**
 * Simple, working storage utility for Caarapace Pulse
 * This version focuses on making the basic CRUD operations work reliably
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
    console.log(`✅ Stored ${key}:`, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

// User Functions
export const getUsers = () => {
  let users = getItem(STORAGE_KEYS.USERS);
  if (!users) {
    users = getSampleUsers();
    setUsers(users);
  }
  console.log('📚 Getting users:', users);
  return users;
};

export const setUsers = (users) => {
  console.log('💾 Setting users:', users);
  return setItem(STORAGE_KEYS.USERS, users);
};

// Employee Functions
export const getEmployees = () => {
  let employees = getItem(STORAGE_KEYS.EMPLOYEES);
  if (!employees) {
    employees = getSampleEmployees();
    setEmployees(employees);
  }
  console.log('📚 Getting employees:', employees);
  return employees;
};

export const setEmployees = (employees) => {
  console.log('💾 Setting employees:', employees);
  return setItem(STORAGE_KEYS.EMPLOYEES, employees);
};

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

// Current User Functions
export const getCurrentUser = () => getItem(STORAGE_KEYS.CURRENT_USER);
export const setCurrentUser = (user) => setItem(STORAGE_KEYS.CURRENT_USER, user);
export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Sample Data
export const getSampleUsers = () => [
  {
    id: 1,
    username: 'john.doe',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP001',
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
    employeeId: 'HR001',
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
    employeeId: 'EMP002',
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
  }
];

export const getSampleAttendance = () => {
  const attendance = [];
  const employees = ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'HR001'];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    if (date.getDay() === 0 || date.getDay() === 6) continue;

    employees.forEach((empId) => {
      const isPresent = Math.random() > 0.1;
      const checkInTime = isPresent ? `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null;
      const checkOutTime = isPresent ? `${17 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null;

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
    reason: 'Medical appointment',
    status: 'Approved',
    appliedDate: '2025-09-08',
    hrComments: 'Approved',
    approvedBy: 'Jane Smith',
    approvedDate: '2025-09-09'
  }
];

// Helper Functions - These are the ones being called by your components
export const addEmployee = (employee) => {
  console.log('🔄 Storage: Adding employee:', employee);
  const employees = getEmployees();
  const newEmployee = {
    ...employee,
    id: Math.max(...employees.map(e => e.id || 0), 0) + 1
  };
  employees.push(newEmployee);
  const success = setEmployees(employees);
  console.log('✅ Storage: Employee added, success:', success);
  return newEmployee;
};

export const updateEmployee = (employeeId, updates) => {
  console.log('🔄 Storage: Updating employee:', employeeId, updates);
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.employeeId === employeeId);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates };
    const success = setEmployees(employees);
    console.log('✅ Storage: Employee updated, success:', success);
    return employees[index];
  }
  console.log('❌ Storage: Employee not found for update');
  return null;
};

export const deleteEmployee = (employeeId) => {
  console.log('🔄 Storage: Deleting employee:', employeeId);
  const employees = getEmployees();
  const filtered = employees.filter(emp => emp.employeeId !== employeeId);
  const success = setEmployees(filtered);
  console.log('✅ Storage: Employee deleted, success:', success);

  // Also clean up related data
  const attendance = getAttendance();
  const filteredAttendance = attendance.filter(record => record.employeeId !== employeeId);
  setAttendance(filteredAttendance);

  const leaveRequests = getLeaveRequests();
  const filteredLeaveRequests = leaveRequests.filter(req => req.employeeId !== employeeId);
  setLeaveRequests(filteredLeaveRequests);

  return true;
};

export const addUser = (userData) => {
  console.log('🔄 Storage: Adding user:', userData);
  const users = getUsers();
  const newUser = {
    ...userData,
    id: Math.max(...users.map(u => u.id || 0), 0) + 1
  };
  users.push(newUser);
  const success = setUsers(users);
  console.log('✅ Storage: User added, success:', success);
  return newUser;
};

export const updateUser = (employeeId, updates) => {
  console.log('🔄 Storage: Updating user:', employeeId, updates);
  const users = getUsers();
  const index = users.findIndex(user => user.employeeId === employeeId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    const success = setUsers(users);
    console.log('✅ Storage: User updated, success:', success);
    return users[index];
  }
  console.log('❌ Storage: User not found for update');
  return null;
};

export const deleteUser = (employeeId) => {
  console.log('🔄 Storage: Deleting user:', employeeId);
  const users = getUsers();
  const filtered = users.filter(user => user.employeeId !== employeeId);
  const success = setUsers(filtered);
  console.log('✅ Storage: User deleted, success:', success);
  return true;
};

export const addLeaveRequest = (leaveRequest) => {
  const leaveRequests = getLeaveRequests();
  const newRequest = {
    ...leaveRequest,
    id: Math.max(...leaveRequests.map(r => r.id || 0), 0) + 1,
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0]
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