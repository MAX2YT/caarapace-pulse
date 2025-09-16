import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getEmployees, 
  setEmployees, 
  getAttendance, 
  setAttendance,
  getLeaveRequests,
  setLeaveRequests,
  addEmployee as addEmployeeToStorage,
  addLeaveRequest as addLeaveRequestToStorage,
  updateLeaveRequest as updateLeaveRequestInStorage
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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this to force re-renders

  useEffect(() => {
    // Load initial data
    setEmployeesState(getEmployees());
    setAttendanceState(getAttendance());
    setLeaveRequestsState(getLeaveRequests());
  }, []);

  // Force refresh function
  const forceRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setAttendanceState(getAttendance());
  };

  // Check-in functionality
  const checkIn = async (employeeId) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);

      // Get fresh attendance data
      const currentAttendance = getAttendance();

      // Check if already checked in today
      const existingRecord = currentAttendance.find(
        record => record.employeeId === employeeId && record.date === today
      );

      if (existingRecord && existingRecord.checkIn && !existingRecord.checkOut) {
        return { success: false, message: 'Already checked in today' };
      }

      let updatedAttendance;
      let record;

      if (existingRecord) {
        // Update existing record
        record = {
          ...existingRecord,
          checkIn: currentTime,
          checkOut: null, // Clear check out time
          status: 'Present',
          hoursWorked: 0
        };
        updatedAttendance = currentAttendance.map(r => 
          r.id === existingRecord.id ? record : r
        );
      } else {
        // Create new record
        record = {
          id: `${employeeId}_${today}`,
          employeeId,
          date: today,
          status: 'Present',
          checkIn: currentTime,
          checkOut: null,
          hoursWorked: 0,
          breakTime: 0
        };
        updatedAttendance = [...currentAttendance, record];
      }

      // Save to localStorage and update state
      setAttendance(updatedAttendance);
      setAttendanceState(updatedAttendance);
      forceRefresh();

      console.log('Check-in successful:', record);
      return { success: true, record };
    } catch (error) {
      console.error('Check-in error:', error);
      return { success: false, message: 'Check-in failed' };
    }
  };

  // Check-out functionality
  const checkOut = async (employeeId) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);

      // Get fresh attendance data
      const currentAttendance = getAttendance();

      // Find today's record
      const todayRecord = currentAttendance.find(
        record => record.employeeId === employeeId && record.date === today
      );

      if (!todayRecord || !todayRecord.checkIn) {
        return { success: false, message: 'No check-in record found for today' };
      }

      if (todayRecord.checkOut) {
        return { success: false, message: 'Already checked out today' };
      }

      // Calculate hours worked
      const checkInTime = new Date(`${today}T${todayRecord.checkIn}`);
      const checkOutTime = new Date(`${today}T${currentTime}`);
      const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

      const updatedRecord = {
        ...todayRecord,
        checkOut: currentTime,
        hoursWorked: Math.round(hoursWorked * 100) / 100
      };

      const updatedAttendance = currentAttendance.map(r => 
        r.id === todayRecord.id ? updatedRecord : r
      );

      // Save to localStorage and update state
      setAttendance(updatedAttendance);
      setAttendanceState(updatedAttendance);
      forceRefresh();

      console.log('Check-out successful:', updatedRecord);
      return { success: true, record: updatedRecord };
    } catch (error) {
      console.error('Check-out error:', error);
      return { success: false, message: 'Check-out failed' };
    }
  };

  // Get current status for an employee - now with fresh data
  const getCurrentStatus = (employeeId) => {
    const today = new Date().toISOString().split('T')[0];

    // Always get fresh data from localStorage
    const freshAttendance = getAttendance();
    const todayRecord = freshAttendance.find(
      record => record.employeeId === employeeId && record.date === today
    );

    console.log('getCurrentStatus for', employeeId, 'today record:', todayRecord);

    return {
      isCheckedIn: todayRecord && todayRecord.checkIn && !todayRecord.checkOut,
      todayRecord: todayRecord || null
    };
  };

  // Get all employee statuses (for HR dashboard)
  const getAllEmployeeStatuses = () => {
    const today = new Date().toISOString().split('T')[0];
    const freshAttendance = getAttendance();

    return employees.map(employee => {
      const todayRecord = freshAttendance.find(
        record => record.employeeId === employee.employeeId && record.date === today
      );

      return {
        ...employee,
        isCheckedIn: todayRecord && todayRecord.checkIn && !todayRecord.checkOut,
        checkInTime: todayRecord?.checkIn || null,
        checkOutTime: todayRecord?.checkOut || null,
        hoursWorked: todayRecord?.hoursWorked || 0,
        status: todayRecord?.status || 'Absent'
      };
    });
  };

  const addEmployee = (employeeData) => {
    const newEmployee = addEmployeeToStorage(employeeData);
    setEmployeesState(getEmployees());
    return newEmployee;
  };

  const addLeaveRequest = (requestData) => {
    const newRequest = addLeaveRequestToStorage(requestData);
    setLeaveRequestsState(getLeaveRequests());
    return newRequest;
  };

  const updateLeaveRequest = (requestId, updates) => {
    const updatedRequest = updateLeaveRequestInStorage(requestId, updates);
    setLeaveRequestsState(getLeaveRequests());
    return updatedRequest;
  };

  const value = {
    employees,
    attendance,
    leaveRequests,
    checkIn,
    checkOut,
    getCurrentStatus,
    getAllEmployeeStatuses,
    addEmployee,
    addLeaveRequest,
    updateLeaveRequest,
    refreshTrigger // Expose this so components can listen to changes
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};