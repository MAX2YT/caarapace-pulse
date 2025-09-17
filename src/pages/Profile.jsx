import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { employees, users, updateUser, updateEmployee } = useData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get employee data
  const employeeData = employees.find(emp => emp.employeeId === user?.profile?.employeeId);

  // Get reporting manager details
  const getReportingManager = () => {
    if (!employeeData?.reportingInCharge) return null;
    return employees.find(emp => emp.employeeId === employeeData.reportingInCharge);
  };

  const reportingManager = getReportingManager();

  const handleEditProfile = () => {
    setFormData({
      name: user.profile.name || '',
      email: user.profile.email || '',
      phone: user.profile.phone || '',
      position: user.profile.position || '',
      department: user.profile.department || ''
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user profile
      const updatedProfile = {
        ...user.profile,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        department: formData.department
      };

      // Update user in DataContext
      await updateUser(user.profile.employeeId, {
        ...user,
        profile: updatedProfile
      });

      // Update employee in DataContext
      await updateEmployee(user.profile.employeeId, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        department: formData.department
      });

      // Update auth context
      if (updateUserProfile) {
        updateUserProfile(updatedProfile);
      }

      setShowEditModal(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate years of service
  const getYearsOfService = () => {
    if (!user.profile.joinDate) return 'N/A';
    const joinDate = new Date(user.profile.joinDate);
    const today = new Date();
    const years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();

    if (years === 0) {
      return months <= 0 ? 'Less than a month' : `${months} month${months > 1 ? 's' : ''}`;
    } else if (months < 0) {
      return `${years - 1} year${years - 1 !== 1 ? 's' : ''} ${12 + months} month${12 + months !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
  };

  const formatJoinDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="error-message">
          <p>Unable to load profile. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1>My Profile</h1>
            <p>View and manage your personal information</p>
          </div>
          <div className="header-actions">
            <Button variant="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* Personal Information */}
        <Card title="Personal Information">
          <div className="profile-field">
            <label className="profile-label">Full Name</label>
            <span className="profile-value">{user.profile.name || 'Not provided'}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Employee ID</label>
            <span className="profile-value">{user.profile.employeeId || 'Not provided'}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Department</label>
            <span className="profile-value">{user.profile.department || 'Not provided'}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Position</label>
            <span className="profile-value">{user.profile.position || 'Not provided'}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Email</label>
            <span className="profile-value">{user.profile.email || 'Not provided'}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Phone</label>
            <span className="profile-value">{user.profile.phone || 'Not provided'}</span>
          </div>
        </Card>

        {/* Employment Information */}
        <Card title="Employment Information">
          <div className="profile-field">
            <label className="profile-label">Join Date</label>
            <span className="profile-value">{formatJoinDate(user.profile.joinDate)}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Years of Service</label>
            <span className="profile-value">{getYearsOfService()}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Employment Status</label>
            <span className="profile-value">
              <span className="status status--active">Active</span>
            </span>
          </div>

          {/* Reporting In-charge Section */}
          <div className="profile-field">
            <label className="profile-label">Reporting In-charge</label>
            <span className="profile-value">
              {reportingManager ? (
                <div className="reporting-manager">
                  <div className="manager-name">{reportingManager.name}</div>
                  <div className="manager-details">
                    {reportingManager.position} • {reportingManager.department}
                  </div>
                  <div className="manager-contact">
                    📧 {reportingManager.email}
                    {reportingManager.phone && (
                      <span> • 📞 {reportingManager.phone}</span>
                    )}
                  </div>
                </div>
              ) : (
                'Not Assigned'
              )}
            </span>
          </div>
        </Card>

        {/* Account Information */}
        <Card title="Account Information">
          <div className="profile-field">
            <label className="profile-label">Username</label>
            <span className="profile-value">{user.username}</span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Role</label>
            <span className="profile-value">
              <span className={`role-badge role-badge--${user.role}`}>
                {user.role === 'hr' ? 'HR Manager' : 'Employee'}
              </span>
            </span>
          </div>

          <div className="profile-field">
            <label className="profile-label">Last Login</label>
            <span className="profile-value">Just now</span>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card title="Quick Stats">
          <div className="stats-grid-small">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Pending Leaves</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">20</div>
              <div className="stat-label">Leave Days Left</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">98%</div>
              <div className="stat-label">Attendance Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <Modal
          title="Edit Profile"
          onClose={() => setShowEditModal(false)}
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
                <label className="form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowEditModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Profile;