import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { formatDate } from '../utils/dateUtils';

const LeaveManagement = () => {
  const { user } = useAuth();
  const { leaveRequests, updateLeaveRequest } = useData();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hrComments, setHrComments] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRequests = leaveRequests.filter(request => 
    statusFilter === 'All' || request.status === statusFilter
  );

  const handleApprove = () => {
    updateLeaveRequest(selectedRequest.id, {
      status: 'Approved',
      hrComments,
      approvedBy: user.profile.name,
      approvedDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(false);
    setSelectedRequest(null);
    setHrComments('');
  };

  const handleReject = () => {
    updateLeaveRequest(selectedRequest.id, {
      status: 'Rejected',
      hrComments,
      approvedBy: user.profile.name,
      approvedDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(false);
    setSelectedRequest(null);
    setHrComments('');
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setHrComments(request.hrComments || '');
    setShowModal(true);
  };

  const columns = [
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'leaveType', header: 'Leave Type' },
    { 
      key: 'startDate', 
      header: 'Start Date',
      render: (date) => formatDate(date, 'short')
    },
    { 
      key: 'endDate', 
      header: 'End Date',
      render: (date) => formatDate(date, 'short')
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => (
        <span className={`status status--${status.toLowerCase()}`}>
          {status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, request) => (
        <Button
          variant="outline"
          size="small"
          onClick={() => openModal(request)}
        >
          Review
        </Button>
      )
    }
  ];

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'Pending').length,
    approved: leaveRequests.filter(r => r.status === 'Approved').length,
    rejected: leaveRequests.filter(r => r.status === 'Rejected').length
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Leave Management</h1>
        <div className="header-actions">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <Card title="Total Requests">
          <div className="stat-value">{stats.total}</div>
        </Card>
        
        <Card title="Pending Review">
          <div className="stat-value stat-value--warning">{stats.pending}</div>
        </Card>
        
        <Card title="Approved">
          <div className="stat-value stat-value--positive">{stats.approved}</div>
        </Card>
        
        <Card title="Rejected">
          <div className="stat-value stat-value--negative">{stats.rejected}</div>
        </Card>
      </div>

      <Card title={`Leave Requests (${filteredRequests.length})`}>
        <Table columns={columns} data={filteredRequests} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Review Leave Request"
        size="large"
      >
        {selectedRequest && (
          <div className="leave-review">
            <div className="request-details">
              <h3>Request Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Employee:</label>
                  <span>{selectedRequest.employeeName} ({selectedRequest.employeeId})</span>
                </div>
                <div className="detail-item">
                  <label>Leave Type:</label>
                  <span>{selectedRequest.leaveType}</span>
                </div>
                <div className="detail-item">
                  <label>Duration:</label>
                  <span>
                    {formatDate(selectedRequest.startDate, 'short')} - {formatDate(selectedRequest.endDate, 'short')}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Applied Date:</label>
                  <span>{formatDate(selectedRequest.appliedDate, 'short')}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Reason:</label>
                  <span>{selectedRequest.reason}</span>
                </div>
              </div>
            </div>

            <div className="hr-comments">
              <label className="form-label">HR Comments</label>
              <textarea
                value={hrComments}
                onChange={(e) => setHrComments(e.target.value)}
                className="form-control"
                rows="4"
                placeholder="Add comments for approval/rejection..."
              />
            </div>

            <div className="form-actions">
              {selectedRequest.status === 'Pending' && (
                <>
                  <Button variant="success" onClick={handleApprove}>
                    Approve
                  </Button>
                  <Button variant="danger" onClick={handleReject}>
                    Reject
                  </Button>
                </>
              )}
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveManagement;