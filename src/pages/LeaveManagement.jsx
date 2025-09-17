import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';

const EmployeeManagement = () => {
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
    salary: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departments = [
    'Engineering', 'Human Resources', 'Marketing', 'Finance', 
    'Sales', 'Operations', 'Customer Support', 'Quality Assurance'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      employeeId: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      joinDate: '',
      salary: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setEditingEmployee(null);
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Invalid phone format';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!editingEmployee && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check for duplicate Employee ID
    const existingEmployee = employees.find(emp => 
      emp.employeeId.toLowerCase() === formData.employeeId.toLowerCase() &&
      (!editingEmployee || emp.id !== editingEmployee.id)
    );
    if (existingEmployee) {
      newErrors.employeeId = 'Employee ID already exists';
    }

    // Check for duplicate username
    const existingUser = users.find(user => 
      user.username.toLowerCase() === formData.username.toLowerCase() &&
      (!editingEmployee || user.employeeId !== editingEmployee.employeeId)
    );
    if (existingUser) {
      newErrors.username = 'Username already exists';
    }

    // Check for duplicate email
    const existingEmailEmployee = employees.find(emp => 
      emp.email.toLowerCase() === formData.email.toLowerCase() &&
      (!editingEmployee || emp.id !== editingEmployee.id)
    );
    if (existingEmailEmployee) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddEmployee = () => {
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
      joinDate: new Date().toISOString().split('T')[0]
    }));
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    const userAccount = users.find(user => user.employeeId === employee.employeeId);

    setFormData({
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      position: employee.position,
      email: employee.email,
      phone: employee.phone,
      joinDate: employee.joinDate,
      salary: employee.salary?.toString() || '',
      username: userAccount?.username || '',
      password: userAccount?.password || '',
      confirmPassword: userAccount?.password || ''
    });
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
        salary: parseFloat(formData.salary),
        status: 'Active'
      };

      const userData = {
        username: formData.username.trim(),
        password: formData.password,
        role: 'employee',
        employeeId: formData.employeeId.trim(),
        profile: {
          name: formData.name.trim(),
          employeeId: formData.employeeId.trim(),
          department: formData.department,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          joinDate: formData.joinDate,
          position: formData.position.trim()
        }
      };

      if (editingEmployee) {
        // Update existing employee and user
        await updateEmployee(editingEmployee.employeeId, employeeData);
        await updateUser(editingEmployee.employeeId, userData);
        setShowEditModal(false);
      } else {
        // Add new employee and user
        await addEmployee(employeeData);
        await addUser(userData);
        setShowAddModal(false);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingEmployee) return;

    setIsSubmitting(true);
    try {
      // Delete employee and their user account
      await deleteEmployee(editingEmployee.employeeId);
      await deleteUser(editingEmployee.employeeId);
      setShowDeleteModal(false);
      resetForm();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'name', header: 'Name' },
    { key: 'department', header: 'Department' },
    { key: 'position', header: 'Position' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
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
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Employee ID *</label>
                <input
                  type="text"
                  name="employeeId"
                  className={`form-control ${errors.employeeId ? 'error' : ''}`}
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="Auto-generated"
                  readOnly
                />
                {errors.employeeId && <div className="error-message">{errors.employeeId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className={`form-control ${errors.department ? 'error' : ''}`}
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <div className="error-message">{errors.department}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Position *</label>
                <input
                  type="text"
                  name="position"
                  className={`form-control ${errors.position ? 'error' : ''}`}
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position/title"
                />
                {errors.position && <div className="error-message">{errors.position}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Join Date *</label>
                <input
                  type="date"
                  name="joinDate"
                  className={`form-control ${errors.joinDate ? 'error' : ''}`}
                  value={formData.joinDate}
                  onChange={handleInputChange}
                />
                {errors.joinDate && <div className="error-message">{errors.joinDate}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Salary *</label>
                <input
                  type="number"
                  name="salary"
                  className={`form-control ${errors.salary ? 'error' : ''}`}
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter salary amount"
                  min="0"
                  step="0.01"
                />
                {errors.salary && <div className="error-message">{errors.salary}</div>}
              </div>

              <div className="form-section-header">
                <h3>Account Information</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  className={`form-control ${errors.username ? 'error' : ''}`}
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username for login"
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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
                {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
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
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
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
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className={`form-control ${errors.department ? 'error' : ''}`}
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <div className="error-message">{errors.department}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Position *</label>
                <input
                  type="text"
                  name="position"
                  className={`form-control ${errors.position ? 'error' : ''}`}
                  value={formData.position}
                  onChange={handleInputChange}
                />
                {errors.position && <div className="error-message">{errors.position}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Join Date *</label>
                <input
                  type="date"
                  name="joinDate"
                  className={`form-control ${errors.joinDate ? 'error' : ''}`}
                  value={formData.joinDate}
                  onChange={handleInputChange}
                />
                {errors.joinDate && <div className="error-message">{errors.joinDate}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Salary *</label>
                <input
                  type="number"
                  name="salary"
                  className={`form-control ${errors.salary ? 'error' : ''}`}
                  value={formData.salary}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
                {errors.salary && <div className="error-message">{errors.salary}</div>}
              </div>

              <div className="form-section-header">
                <h3>Account Information</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  className={`form-control ${errors.username ? 'error' : ''}`}
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
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
                {isSubmitting ? 'Updating Employee...' : 'Update Employee'}
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

export default EmployeeManagement;