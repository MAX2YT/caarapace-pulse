import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getEmployees, 
  setEmployees, 
  getAttendance, 
  setAttendance, 
  getLeaveRequests, 
  setLeaveRequests 
} from '../utils/storage';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [employees, setEmployeesState] = useState([]);
  const [attendance, setAttendanceState] = useState([]);
  const [leaveRequests, setLeaveRequestsState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEmployeesState(getEmployees());
    setAttendanceState(getAttendance());
    setLeaveRequestsState(getLeaveRequests());
    setLoading(false);
  };

  const updateEmployees = (newEmployees) => {
    setEmployees(newEmployees);
    setEmployeesState(newEmployees);
  };

  const updateAttendance = (newAttendance) => {
    setAttendance(newAttendance);
    setAttendanceState(newAttendance);
  };

  const updateLeaveRequests = (newLeaveRequests) => {
    setLeaveRequests(newLeaveRequests);
    setLeaveRequestsState(newLeaveRequests);
  };

  const addEmployee = (employee) => {
    const newEmployees = [...employees, { ...employee, id: Date.now() }];
    updateEmployees(newEmployees);
  };

  const updateEmployee = (id, updatedEmployee) => {
    const newEmployees = employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedEmployee } : emp
    );
    updateEmployees(newEmployees);
  };

  const addLeaveRequest = (leaveRequest) => {
    const newLeaveRequest = {
      ...leaveRequest,
      id: Date.now(),
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    const newLeaveRequests = [...leaveRequests, newLeaveRequest];
    updateLeaveRequests(newLeaveRequests);
  };

  const updateLeaveRequest = (id, updates) => {
    const newLeaveRequests = leaveRequests.map(request =>
      request.id === id ? { ...request, ...updates } : request
    );
    updateLeaveRequests(newLeaveRequests);
  };

  const value = {
    employees,
    attendance,
    leaveRequests,
    loading,
    addEmployee,
    updateEmployee,
    addLeaveRequest,
    updateLeaveRequest,
    refreshData: loadData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};