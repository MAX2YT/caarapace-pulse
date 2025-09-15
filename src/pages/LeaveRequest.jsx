import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';

const LeaveRequest = () => {
  const { user } = useAuth();
  const { leaveRequests, addLeaveRequest } = useData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const userLeaveRequests = leaveRequests.filter(request => 
    request.employeeId === user.profile.employeeId
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const leaveRequest = {
      employeeId: user.profile.employeeId,
      employeeName: user.profile.name,
      ...formData
    };

    addLeaveRequest(leaveRequest);
    setShowModal(false);
    setFormData({
      leaveType: 'Annual Leave',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const columns = [
    { key: 'leaveType', header: 'Leave Type' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'reason', header: 'Reason' },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => (
        <span className={`status status--${status.toLowerCase()}`}>
          {status}
        </span>
      )
    },
    { key: 'appliedDate', header: 'Applied Date' }
  ];

  const leaveBalance = {
    annual: 20,
    sick: 10,
    personal: 5,
    used: userLeaveRequests
      .filter(req => req.status === 'Approved')
      .reduce((sum, req) => {
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      }, 0)
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Leave Requests</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Request Leave
        </Button>
      </div>

      <div className="stats-grid">
        <Card title="Annual Leave">
          <div className="stat-value">{leaveBalance.annual - leaveBalance.used} days remaining</div>
        </Card>
        
        <Card title="Sick Leave">
          <div className="stat-value">{leaveBalance.sick} days available</div>
        </Card>
        
        <Card title="Personal Leave">
          <div className="stat-value">{leaveBalance.personal} days available</div>
        </Card>
        
        <Card title="Used This Year">
          <div className="stat-value">{leaveBalance.used} days</div>
        </Card>
      </div>

      <Card title="My Leave History">
        <Table columns={columns} data={userLeaveRequests} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Request Leave"
      >
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            />
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary">
              Submit Request
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveRequest;