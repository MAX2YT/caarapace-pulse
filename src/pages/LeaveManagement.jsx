import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';

const LeaveManagement = () => {
  const { user } = useAuth();
  const { leaveRequests, updateLeaveRequest, employees } = useData();
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    let filtered = leaveRequests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [leaveRequests, searchTerm, statusFilter]);

  const handleApprove = async (request) => {
    try {
      await updateLeaveRequest(request.id, {
        status: 'Approved',
        approvedBy: user.profile.name,
        approvedDate: new Date().toISOString().split('T')[0],
        hrComments: 'Approved by HR'
      });
    } catch (error) {
      console.error('Error approving leave request:', error);
      alert('Error approving leave request. Please try again.');
    }
  };

  const handleReject = async (request) => {
    const reason = prompt('Please enter reason for rejection:');
    if (reason) {
      try {
        await updateLeaveRequest(request.id, {
          status: 'Rejected',
          approvedBy: user.profile.name,
          approvedDate: new Date().toISOString().split('T')[0],
          hrComments: reason
        });
      } catch (error) {
        console.error('Error rejecting leave request:', error);
        alert('Error rejecting leave request. Please try again.');
      }
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'status--approved';
      case 'Rejected': return 'status--rejected';
      default: return 'status--pending';
    }
  };

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'leaveType', header: 'Leave Type' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => (
        <span className={`status ${getStatusColor(status)}`}>
          {status}
        </span>
      )
    },
    { key: 'appliedDate', header: 'Applied Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, request) => (
        <div className="action-buttons">
          <Button 
            size="small" 
            variant="secondary" 
            onClick={() => handleViewDetails(request)}
          >
            View
          </Button>
          {request.status === 'Pending' && (
            <>
              <Button 
                size="small" 
                variant="success" 
                onClick={() => handleApprove(request)}
              >
                Approve
              </Button>
              <Button 
                size="small" 
                variant="danger" 
                onClick={() => handleReject(request)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(req => req.status === 'Pending').length,
    approved: leaveRequests.filter(req => req.status === 'Approved').length,
    rejected: leaveRequests.filter(req => req.status === 'Rejected').length
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Leave Management</h1>
            <p>Review and manage employee leave requests</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <Card title="Total Requests">
          <div className="stat-value">{stats.total}</div>
        </Card>

        <Card title="Pending Requests">
          <div className="stat-value stat-value--warning">{stats.pending}</div>
        </Card>

        <Card title="Approved Requests">
          <div className="stat-value stat-value--positive">{stats.approved}</div>
        </Card>

        <Card title="Rejected Requests">
          <div className="stat-value stat-value--negative">{stats.rejected}</div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card title="Search & Filter">
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by employee name, ID, or leave type..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-control filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Leave Requests Table */}
      <Card title={`Leave Requests (${filteredRequests.length})`}>
        <Table columns={columns} data={filteredRequests} />
      </Card>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <Modal
          title="Leave Request Details"
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
        >
          <div className="request-details">
            <div className="detail-grid">
              <div className="detail-item">
                <label>Employee Name:</label>
                <span>{selectedRequest.employeeName}</span>
              </div>
              <div className="detail-item">
                <label>Employee ID:</label>
                <span>{selectedRequest.employeeId}</span>
              </div>
              <div className="detail-item">
                <label>Leave Type:</label>
                <span>{selectedRequest.leaveType}</span>
              </div>
              <div className="detail-item">
                <label>Start Date:</label>
                <span>{selectedRequest.startDate}</span>
              </div>
              <div className="detail-item">
                <label>End Date:</label>
                <span>{selectedRequest.endDate}</span>
              </div>
              <div className="detail-item">
                <label>Status:</label>
                <span className={`status ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>
              <div className="detail-item">
                <label>Applied Date:</label>
                <span>{selectedRequest.appliedDate}</span>
              </div>
              {selectedRequest.approvedBy && (
                <div className="detail-item">
                  <label>Approved By:</label>
                  <span>{selectedRequest.approvedBy}</span>
                </div>
              )}
              {selectedRequest.approvedDate && (
                <div className="detail-item">
                  <label>Decision Date:</label>
                  <span>{selectedRequest.approvedDate}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <label>Reason:</label>
              <p className="reason-text">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.hrComments && (
              <div className="detail-section">
                <label>HR Comments:</label>
                <p className="comments-text">{selectedRequest.hrComments}</p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedRequest(null);
              }}
            >
              Close
            </Button>
            {selectedRequest.status === 'Pending' && (
              <>
                <Button 
                  variant="success" 
                  onClick={() => {
                    handleApprove(selectedRequest);
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                  }}
                >
                  Approve
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    handleReject(selectedRequest);
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                  }}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeaveManagement;