import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getEmployees, 
  getUsers,
  getAttendance, 
  getLeaveRequests,
  setAttendance,
  addEmployee as addEmployeeToStorage,
  updateEmployee as updateEmployeeInStorage,
  deleteEmployee as deleteEmployeeFromStorage,
  addUser as addUserToStorage,
  updateUser as updateUserInStorage,
  deleteUser as deleteUserFromStorage,
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
  const [users, setUsersState] = useState([]);
  const [attendance, setAttendanceState] = useState([]);
  const [leaveRequests, setLeaveRequestsState] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force refresh all data
  const refreshAllData = () => {
    console.log('🔄 DataContext: Refreshing all data...');
    const freshEmployees = getEmployees();
    const freshUsers = getUsers();
    const freshAttendance = getAttendance();
    const freshLeaveRequests = getLeaveRequests();

    setEmployeesState(freshEmployees);
    setUsersState(freshUsers);
    setAttendanceState(freshAttendance);
    setLeaveRequestsState(freshLeaveRequests);
    setRefreshTrigger(prev => prev + 1);

    console.log('✅ DataContext: Data refreshed', {
      employees: freshEmployees.length,
      users: freshUsers.length,
      attendance: freshAttendance.length,
      leaveRequests: freshLeaveRequests.length
    });
  };

  useEffect(() => {
    console.log('🚀 DataContext: Initial data load...');
    refreshAllData();
  }, []);

  // Employee Management Functions
  const addEmployee = (employeeData) => {
    console.log('📝 DataContext: Adding employee:', employeeData);
    try {
      const newEmployee = addEmployeeToStorage(employeeData);
      console.log('✅ DataContext: Employee added to storage');

      // Force immediate refresh
      setTimeout(() => {
        refreshAllData();
      }, 100);

      return newEmployee;
    } catch (error) {
      console.error('❌ DataContext: Error adding employee:', error);
      throw error;
    }
  };

  const updateEmployee = (employeeId, employeeData) => {
    console.log('📝 DataContext: Updating employee:', employeeId, employeeData);
    try {
      const updatedEmployee = updateEmployeeInStorage(employeeId, employeeData);
      console.log('✅ DataContext: Employee updated in storage');

      // Force immediate refresh
      setTimeout(() => {
        refreshAllData();
      }, 100);

      return updatedEmployee;
    } catch (error) {
      console.error('❌ DataContext: Error updating employee:', error);
      throw error;
    }
  };

  const deleteEmployee = (employeeId) => {
    console.log('📝 DataContext: Deleting employee:', employeeId);
    try {
      deleteEmployeeFromStorage(employeeId);
      console.log('✅ DataContext: Employee deleted from storage');

      // Force immediate refresh
      setTimeout(() => {
        refreshAllData();
      }, 100);

      return true;
    } catch (error) {
      console.error('❌ DataContext: Error deleting employee:', error);
      throw error;
    }
  };

  // User Management Functions
  const addUser = (userData) => {
    console.log('📝 DataContext: Adding user:', userData);
    try {
      const newUser = addUserToStorage(userData);
      console.log('✅ DataContext: User added to storage');

      // Force immediate refresh
      setTimeout(() => {
        refreshAllData();
      }, 100);

      return newUser;
    } catch (error) {
      console.error('❌ DataContext: Error adding user:', error);
      throw error;
    }
  };

  const updateUser = (employeeId, userData) => {
    console.log('📝 DataContext: Updating user:', employeeId, userData);
    try {
      const updatedUser = updateUserInStorage(employeeId, userData);
      console.log('✅ DataContext: User updated in storage');

      // Force immediate refresh
      setTimeout(() => {
        refreshAllData();
      }, 100);

      return updatedUser;
    } catch (error) {
      console.error('❌ DataContext: Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = (employeeId) => {
    console.log('📝 DataContext: Deleting user:', employeeId);
    try {
      deleteUserFromStorage(employeeId);
      console.log('✅ DataContext: User deleted from storage');

      // Force immediate refresh
      setTimeout(() => {
        refreshAllData();
      }, 100);

      return true;
    } catch (error) {
      console.error('❌ DataContext: Error deleting user:', error);
      throw error;
    }
  };

  // Attendance Functions
  const checkIn = async (employeeId) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);

      const currentAttendance = getAttendance();
      const existingRecord = currentAttendance.find(
        record => record.employeeId === employeeId && record.date === today
      );

      if (existingRecord && existingRecord.checkIn && !existingRecord.checkOut) {
        return { success: false, message: 'Already checked in today' };
      }

      let updatedAttendance;
      let record;

      if (existingRecord) {
        record = { ...existingRecord, checkIn: currentTime, checkOut: null, status: 'Present', hoursWorked: 0 };
        updatedAttendance = currentAttendance.map(r => r.id === existingRecord.id ? record : r);
      } else {
        record = {
          id: `${employeeId}_${today}`,
          employeeId, date: today, status: 'Present',
          checkIn: currentTime, checkOut: null, hoursWorked: 0, breakTime: 0
        };
        updatedAttendance = [...currentAttendance, record];
      }

      setAttendance(updatedAttendance);
      refreshAllData();
      return { success: true, record };
    } catch (error) {
      console.error('Check-in error:', error);
      return { success: false, message: 'Check-in failed' };
    }
  };

  const checkOut = async (employeeId) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);

      const currentAttendance = getAttendance();
      const todayRecord = currentAttendance.find(
        record => record.employeeId === employeeId && record.date === today
      );

      if (!todayRecord || !todayRecord.checkIn) {
        return { success: false, message: 'No check-in record found for today' };
      }

      if (todayRecord.checkOut) {
        return { success: false, message: 'Already checked out today' };
      }

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

      setAttendance(updatedAttendance);
      refreshAllData();
      return { success: true, record: updatedRecord };
    } catch (error) {
      console.error('Check-out error:', error);
      return { success: false, message: 'Check-out failed' };
    }
  };

  const getCurrentStatus = (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    const freshAttendance = getAttendance();
    const todayRecord = freshAttendance.find(
      record => record.employeeId === employeeId && record.date === today
    );

    return {
      isCheckedIn: todayRecord && todayRecord.checkIn && !todayRecord.checkOut,
      todayRecord: todayRecord || null
    };
  };

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

  // Leave request functions
  const addLeaveRequest = (requestData) => {
    try {
      const newRequest = addLeaveRequestToStorage(requestData);
      refreshAllData();
      return newRequest;
    } catch (error) {
      console.error('Error adding leave request:', error);
      throw error;
    }
  };

  const updateLeaveRequest = (requestId, updates) => {
    try {
      const updatedRequest = updateLeaveRequestInStorage(requestId, updates);
      refreshAllData();
      return updatedRequest;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  };

  console.log('🔄 DataContext: Rendering with data:', {
    employees: employees.length,
    users: users.length,
    attendance: attendance.length,
    leaveRequests: leaveRequests.length,
    refreshTrigger
  });

  const value = {
    employees,
    users,
    attendance,
    leaveRequests,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addUser,
    updateUser,
    deleteUser,
    checkIn,
    checkOut,
    getCurrentStatus,
    getAllEmployeeStatuses,
    addLeaveRequest,
    updateLeaveRequest,
    refreshAllData,
    refreshTrigger
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};