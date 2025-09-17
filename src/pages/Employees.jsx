import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Employees = () => {
  const { 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    users,
    addUser,
    updateUser,
    deleteUser 
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    joinDate: '',
    reportingInCharge: '', // Changed from salary
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Engineering', 'Human Resources', 'Marketing', 'Finance', 
    'Sales', 'Operations', 'Customer Support', 'Quality Assurance'
  ];

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get list of potential reporting managers (existing employees)
  const getReportingManagers = () => {
    return employees.filter(emp => 
      // Don't include the employee being edited in their own reporting manager list
      editingEmployee ? emp.employeeId !== editingEmployee.employeeId : true
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      employeeId: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      joinDate: '',
      reportingInCharge: '', // Changed from salary
      username: '',
      password: ''
    });
    setEditingEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmployee = () => {
    console.log('Add Employee button clicked');
    resetForm();
    // Auto-generate Employee ID
    const maxId = employees.reduce((max, emp) => {
      const num = parseInt(emp.employeeId.replace(/\D/g, ''));
      return num > max ? num : max;
    }, 0);
    const newEmployeeId = `EMP${(maxId + 1).toString().padStart(3, '0')}`;

    setFormData(prev => ({
      ...prev,
      employeeId: newEmployeeId,
      joinDate: new Date().toISOString().split('T')[0],
      username: newEmployeeId.toLowerCase(),
      password: 'password123'
    }));
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    console.log('Edit Employee button clicked:', employee);
    const userAccount = users.find(user => user.employeeId === employee.employeeId);

    setFormData({
      name: employee.name || '',
      employeeId: employee.employeeId || '',
      department: employee.department || '',
      position: employee.position || '',
      email: employee.email || '',
      phone: employee.phone || '',
      joinDate: employee.joinDate || '',
      reportingInCharge: employee.reportingInCharge || '', // Changed from salary
      username: userAccount?.username || employee.employeeId?.toLowerCase() || '',
      password: userAccount?.password || 'password123'
    });
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (employee) => {
    console.log('Delete Employee button clicked:', employee);
    setEditingEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const employeeData = {
        name: formData.name.trim(),
        employeeId: formData.employeeId.trim(),
        department: formData.department,
        position: formData.position.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        joinDate: formData.joinDate,
        reportingInCharge: formData.reportingInCharge, // Changed from salary
        status: 'Active'
      };

      const userData = {
        username: formData.username.trim() || formData.employeeId.toLowerCase(),
        password: formData.password || 'password123',
        role: 'employee',
        employeeId: formData.employeeId.trim(),
        profile: {
          name: formData.name.trim(),
          employeeId: formData.employeeId.trim(),
          department: formData.department,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          joinDate: formData.joinDate,
          position: formData.position.trim(),
          reportingInCharge: formData.reportingInCharge // Added to profile
        }
      };

      if (editingEmployee) {
        // Update existing employee and user
        console.log('Updating employee:', employeeData);
        updateEmployee(editingEmployee.employeeId, employeeData);
        updateUser(editingEmployee.employeeId, userData);
        setShowEditModal(false);
        alert('Employee updated successfully!');
      } else {
        // Add new employee and user
        console.log('Adding new employee:', employeeData);
        addEmployee(employeeData);
        addUser(userData);
        setShowAddModal(false);
        alert('Employee added successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingEmployee) return;

    console.log('Deleting employee:', editingEmployee);
    setIsSubmitting(true);
    try {
      // Delete employee and their user account
      deleteEmployee(editingEmployee.employeeId);
      deleteUser(editingEmployee.employeeId);
      setShowDeleteModal(false);
      resetForm();
      alert('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get reporting manager name
  const getReportingManagerName = (employeeId) => {
    const manager = employees.find(emp => emp.employeeId === employeeId);
    return manager ? manager.name : 'Not Assigned';
  };

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'name', header: 'Name' },
    { key: 'department', header: 'Department' },
    { key: 'position', header: 'Position' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { 
      key: 'reportingInCharge', 
      header: 'Reporting Manager',
      render: (reportingInCharge) => (
        <span>{getReportingManagerName(reportingInCharge)}</span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => (
        <span className={`status status--${status?.toLowerCase() || 'inactive'}`}>
          {status || 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, employee) => (
        <div className="action-buttons">
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => handleEditEmployee(employee)}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="small"
            onClick={() => handleDeleteEmployee(employee)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Employee Management</h1>
            <p>Manage employee records and accounts</p>
          </div>
          <div className="header-actions">
            <Button variant="primary" onClick={handleAddEmployee}>
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card title="Search & Filter">
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search employees..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-info">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>
      </Card>

      {/* Employee Table */}
      <Card title={`Employees (${filteredEmployees.length})`}>
        <Table columns={columns} data={filteredEmployees} />
      </Card>

      {/* Add Employee Modal */}
      {showAddModal && (
        <Modal
          title="Add New Employee"
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  className="form-control"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Position *</label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  className="form-control"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reporting In-charge</label>
                <select
                  name="reportingInCharge"
                  className="form-control"
                  value={formData.reportingInCharge}
                  onChange={handleInputChange}
                >
                  <option value="">Select Reporting Manager</option>
                  {getReportingManagers().map(manager => (
                    <option key={manager.employeeId} value={manager.employeeId}>
                      {manager.name} ({manager.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section-header">
                <h3>Login Credentials</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Employee'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && (
        <Modal
          title="Edit Employee"
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  className="form-control"
                  value={formData.employeeId}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Position *</label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  className="form-control"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reporting In-charge</label>
                <select
                  name="reportingInCharge"
                  className="form-control"
                  value={formData.reportingInCharge}
                  onChange={handleInputChange}
                >
                  <option value="">Select Reporting Manager</option>
                  {getReportingManagers().map(manager => (
                    <option key={manager.employeeId} value={manager.employeeId}>
                      {manager.name} ({manager.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section-header">
                <h3>Login Credentials</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Employee'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && editingEmployee && (
        <Modal
          title="Delete Employee"
          onClose={() => {
            setShowDeleteModal(false);
            resetForm();
          }}
        >
          <div className="delete-confirmation">
            <div className="warning-icon">⚠️</div>
            <h3>Are you sure you want to delete this employee?</h3>
            <div className="employee-info">
              <p><strong>Name:</strong> {editingEmployee.name}</p>
              <p><strong>Employee ID:</strong> {editingEmployee.employeeId}</p>
              <p><strong>Department:</strong> {editingEmployee.department}</p>
            </div>
            <div className="warning-text">
              <p>This action will permanently delete:</p>
              <ul>
                <li>Employee record and personal information</li>
                <li>Login account and credentials</li>
                <li>All attendance records</li>
                <li>All leave requests</li>
                <li>All associated data</li>
              </ul>
              <p><strong>This action cannot be undone!</strong></p>
            </div>
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setShowDeleteModal(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Yes, Delete Employee'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Employees;