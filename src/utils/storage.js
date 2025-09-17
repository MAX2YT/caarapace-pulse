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

// Generic localStorage helpers
export const getItem = key => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
    return false;
  }
};

// USER FUNCTIONS

export const getUsers = () => {
  let users = getItem(STORAGE_KEYS.USERS);
  if (!users) {
    users = getSampleUsers();
    setUsers(users);
  }
  return users;
};

export const setUsers = users => setItem(STORAGE_KEYS.USERS, users);

export const getCurrentUser = () => getItem(STORAGE_KEYS.CURRENT_USER);
export const setCurrentUser = user => setItem(STORAGE_KEYS.CURRENT_USER, user);
export const clearCurrentUser = () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

// EMPLOYEE FUNCTIONS

export const getEmployees = () => {
  let emps = getItem(STORAGE_KEYS.EMPLOYEES);
  if (!emps) {
    emps = getSampleEmployees();
    setEmployees(emps);
  }
  return emps;
};

export const setEmployees = emps => setItem(STORAGE_KEYS.EMPLOYEES, emps);

// ATTENDANCE FUNCTIONS

export const getAttendance = () => {
  let att = getItem(STORAGE_KEYS.ATTENDANCE);
  if (!att) {
    att = getSampleAttendance();
    setAttendance(att);
  }
  return att;
};

export const setAttendance = att => setItem(STORAGE_KEYS.ATTENDANCE, att);

// LEAVE REQUEST FUNCTIONS

export const getLeaveRequests = () => {
  let lr = getItem(STORAGE_KEYS.LEAVE_REQUESTS);
  if (!lr) {
    lr = getSampleLeaveRequests();
    setLeaveRequests(lr);
  }
  return lr;
};

export const setLeaveRequests = lr => setItem(STORAGE_KEYS.LEAVE_REQUESTS, lr);

// SAMPLE DATA GENERATORS

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
      position: 'Software Engineer',
      email: 'john.doe@caarapace.com',
      phone: '+1-234-567-8901',
      joinDate: '2023-01-15',
      reportingInCharge: 'EMP004'
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
      position: 'HR Manager',
      email: 'jane.smith@caarapace.com',
      phone: '+1-234-567-8902',
      joinDate: '2022-05-10',
      reportingInCharge: ''
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
      position: 'Marketing Specialist',
      email: 'mike.johnson@caarapace.com',
      phone: '+1-234-567-8903',
      joinDate: '2023-03-20',
      reportingInCharge: 'EMP005'
    }
  },
  {
    id: 4,
    username: 'sarah.wilson',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP003',
    profile: {
      name: 'Sarah Wilson',
      employeeId: 'EMP003',
      department: 'Finance',
      position: 'Financial Analyst',
      email: 'sarah.wilson@caarapace.com',
      phone: '+1-234-567-8904',
      joinDate: '2023-02-10',
      reportingInCharge: 'EMP006'
    }
  },
  {
    id: 5,
    username: 'david.brown',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP004',
    profile: {
      name: 'David Brown',
      employeeId: 'EMP004',
      department: 'Engineering',
      position: 'Senior Developer',
      email: 'david.brown@caarapace.com',
      phone: '+1-234-567-8905',
      joinDate: '2022-08-15',
      reportingInCharge: 'HR001'
    }
  }
];

export const getSampleEmployees = () => [
  {
    id: 1,
    name: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    position: 'Software Engineer',
    email: 'john.doe@caarapace.com',
    phone: '+1-234-567-8901',
    joinDate: '2023-01-15',
    status: 'Active',
    reportingInCharge: 'EMP004'
  },
  {
    id: 2,
    name: 'Jane Smith',
    employeeId: 'HR001',
    department: 'Human Resources',
    position: 'HR Manager',
    email: 'jane.smith@caarapace.com',
    phone: '+1-234-567-8902',
    joinDate: '2022-05-10',
    status: 'Active',
    reportingInCharge: ''
  },
  {
    id: 3,
    name: 'Mike Johnson',
    employeeId: 'EMP002',
    department: 'Marketing',
    position: 'Marketing Specialist',
    email: 'mike.johnson@caarapace.com',
    phone: '+1-234-567-8903',
    joinDate: '2023-03-20',
    status: 'Active',
    reportingInCharge: 'EMP005'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    employeeId: 'EMP003',
    department: 'Finance',
    position: 'Financial Analyst',
    email: 'sarah.wilson@caarapace.com',
    phone: '+1-234-567-8904',
    joinDate: '2023-02-10',
    status: 'Active',
    reportingInCharge: 'EMP006'
  },
  {
    id: 5,
    name: 'David Brown',
    employeeId: 'EMP004',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'david.brown@caarapace.com',
    phone: '+1-234-567-8905',
    joinDate: '2022-08-15',
    status: 'Active',
    reportingInCharge: 'HR001'
  }
];

export const getSampleAttendance = () => {
  const attendance = [];
  const employees = ['EMP001','EMP002','EMP003','EMP004','HR001'];
  const today = new Date();
  for (let i=0; i<30; i++){
    const d = new Date(today); d.setDate(d.getDate()-i);
    if ([0,6].includes(d.getDay())) continue;
    const ds = d.toISOString().split('T')[0];
    employees.forEach(empId => {
      const present = Math.random()>0.1;
      attendance.push({
        id:`${empId}_${ds}`,
        employeeId: empId,
        date: ds,
        status: present?'Present':'Absent',
        checkIn: present?`0${8+Math.floor(Math.random()*2)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`:null,
        checkOut: present?`${17+Math.floor(Math.random()*2)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`:null,
        hoursWorked: present?8:(0),
        breakTime: present?1:0
      });
    });
  }
  return attendance.sort((a,b)=>new Date(b.date)-new Date(a.date));
};

export const getSampleLeaveRequests = () => [
  {
    id:1,
    employeeId:'EMP001',
    employeeName:'John Doe',
    leaveType:'Annual Leave',
    startDate:'2025-09-25',
    endDate:'2025-09-27',
    reason:'Family vacation',
    status:'Pending',
    appliedDate:'2025-09-10',
    hrComments:'',
    approvedBy:'',
    approvedDate:''
  },
  {
    id:2,
    employeeId:'EMP002',
    employeeName:'Mike Johnson',
    leaveType:'Sick Leave',
    startDate:'2025-09-20',
    endDate:'2025-09-22',
    reason:'Medical appointment',
    status:'Approved',
    appliedDate:'2025-09-08',
    hrComments:'Approved',
    approvedBy:'Jane Smith',
    approvedDate:'2025-09-09'
  }
];

// CRUD OPERATIONS

export const addEmployee = employee => {
  const emps = getEmployees();
  const newEmp = { ...employee, id: Math.max(...emps.map(e=>e.id),0)+1 };
  emps.push(newEmp);
  setEmployees(emps);
  return newEmp;
};

export const updateEmployee = (eid, updates) => {
  const emps = getEmployees();
  const idx = emps.findIndex(e=>e.employeeId===eid);
  if(idx>-1){
    emps[idx] = { ...emps[idx], ...updates };
    setEmployees(emps);
    return emps[idx];
  }
  return null;
};

export const deleteEmployee = eid => {
  const emps = getEmployees().filter(e=>e.employeeId!==eid);
  setEmployees(emps);
  // clean related records
  setAttendance(getAttendance().filter(r=>r.employeeId!==eid));
  setLeaveRequests(getLeaveRequests().filter(r=>r.employeeId!==eid));
  return true;
};

export const addUser = user => {
  const us = getUsers();
  const newU = { ...user, id: Math.max(...us.map(u=>u.id),0)+1 };
  us.push(newU);
  setUsers(us);
  return newU;
};

export const updateUser = (eid, updates) => {
  const us = getUsers();
  const idx = us.findIndex(u=>u.employeeId===eid);
  if(idx>-1){
    us[idx] = { ...us[idx], ...updates };
    setUsers(us);
    return us[idx];
  }
  return null;
};

export const deleteUser = eid => {
  const us = getUsers().filter(u=>u.employeeId!==eid);
  setUsers(us);
  return true;
};

export const addLeaveRequest = lr => {
  const lrs = getSampleLeaveRequests();
  const newLR = { ...lr, id: Math.max(...lrs.map(r=>r.id),0)+1 };
  lrs.push(newLR);
  setLeaveRequests(lrs);
  return newLR;
};

export const updateLeaveRequest = (rid, updates) => {
  const lrs = getLeaveRequests();
  const idx = lrs.findIndex(r=>r.id===rid);
  if(idx>-1){
    lrs[idx] = { ...lrs[idx], ...updates };
    setLeaveRequests(lrs);
    return lrs[idx];
  }
  return null;
};
