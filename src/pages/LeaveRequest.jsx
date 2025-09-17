import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';

const LeaveRequest = () => {
  const { user } = useAuth();
  const { addLeaveRequest, leaveRequests } = useData();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get employee's leave requests
  const myLeaveRequests = leaveRequests.filter(
    request => request.employeeId === user?.profile?.employeeId
  );

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Maternity/Paternity Leave',
    'Emergency Leave',
    'Bereavement Leave',
    'Study Leave'
  ];

  const resetForm = () => {
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenRequestModal = () => {
    resetForm();
    setShowRequestModal(true);
  };

  const handleCloseModal = () => {
    setShowRequestModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        employeeId: user.profile.employeeId,
        employeeName: user.profile.name,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        hrComments: '',
        approvedBy: '',
        approvedDate: ''
      };

      await addLeaveRequest(requestData);
      alert('Leave request submitted successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'status--approved';
      case 'Rejected': return 'status--rejected';
      default: return 'status--pending';
    }
  };

  // Calculate leave statistics
  const leaveStats = {
    totalRequests: myLeaveRequests.length,
    pending: myLeaveRequests.filter(req => req.status === 'Pending').length,
    approved: myLeaveRequests.filter(req => req.status === 'Approved').length,
    rejected: myLeaveRequests.filter(req => req.status === 'Rejected').length,

    // Calculate days for different leave types (simplified)
    annualLeaveUsed: myLeaveRequests
      .filter(req => req.leaveType === 'Annual Leave' && req.status === 'Approved')
      .reduce((total, req) => {
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0)
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Leave Request</h1>
            <p>Request time off and manage your leave applications</p>
          </div>
          <div className="header-actions">
            <Button variant="primary" onClick={handleOpenRequestModal}>
              Request Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Leave Statistics */}
      <div className="stats-grid">
        <Card title="Annual Leave">
          <div className="stat-content">
            <div className="stat-value">{20 - leaveStats.annualLeaveUsed} days</div>
            <div className="stat-label">remaining</div>
          </div>
        </Card>

        <Card title="Sick Leave">
          <div className="stat-content">
            <div className="stat-value">10 days</div>
            <div className="stat-label">available</div>
          </div>
        </Card>

        <Card title="Used This Year">
          <div className="stat-content">
            <div className="stat-value">{leaveStats.annualLeaveUsed} days</div>
            <div className="stat-label">annual leave</div>
          </div>
        </Card>

        <Card title="Pending Requests">
          <div className="stat-content">
            <div className="stat-value stat-value--warning">{leaveStats.pending}</div>
            <div className="stat-label">awaiting approval</div>
          </div>
        </Card>
      </div>

      {/* Leave History */}
      <Card title="My Leave History">
        {myLeaveRequests.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any leave requests yet.</p>
            <Button variant="primary" onClick={handleOpenRequestModal}>
              Submit Your First Request
            </Button>
          </div>
        ) : (
          <div className="leave-history">
            <div className="leave-history-header">
              <div className="history-col">Leave Type</div>
              <div className="history-col">Dates</div>
              <div className="history-col">Reason</div>
              <div className="history-col">Status</div>
              <div className="history-col">Applied Date</div>
            </div>

            {myLeaveRequests
              .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
              .map((request) => (
                <div key={request.id} className="leave-history-row">
                  <div className="history-col">
                    <strong>{request.leaveType}</strong>
                  </div>
                  <div className="history-col">
                    {request.startDate} to {request.endDate}
                  </div>
                  <div className="history-col">
                    {request.reason}
                  </div>
                  <div className="history-col">
                    <span className={`status ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="history-col">
                    {request.appliedDate}
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* Request Leave Modal - ONLY shows when button is clicked */}
      {showRequestModal && (
        <Modal
          title="Request Leave"
          onClose={handleCloseModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Leave Type *</label>
                <select
                  name="leaveType"
                  className="form-control"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                {/* Empty column for grid layout */}
              </div>

              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Reason *</label>
                <textarea
                  name="reason"
                  className="form-control"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LeaveRequest;