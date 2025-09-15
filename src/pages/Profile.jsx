import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user.profile);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Update user profile logic here
    setIsEditing(false);
    // In a real app, you'd update the user in storage/context
  };

  const handleCancel = () => {
    setFormData(user.profile);
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <Button 
          variant={isEditing ? "secondary" : "primary"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="profile-grid">
        <Card title="Personal Information">
          <div className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{formData.name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <div className="form-value">{formData.employeeId}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <div className="form-value">{formData.department}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Position</label>
              <div className="form-value">{formData.position}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{formData.email}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <div className="form-value">{formData.phone}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Join Date</label>
              <div className="form-value">
                {new Date(formData.joinDate).toLocaleDateString()}
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;