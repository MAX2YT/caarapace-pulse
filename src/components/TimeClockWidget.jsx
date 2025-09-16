import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Card from './Card';
import Button from './Button';

const TimeClockWidget = () => {
  const { user } = useAuth();
  const { checkIn, checkOut, getCurrentStatus, refreshTrigger } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update status when user changes or when refreshTrigger changes
  useEffect(() => {
    if (user?.profile?.employeeId) {
      updateStatus();
    }
  }, [user, refreshTrigger]);

  const updateStatus = () => {
    if (user?.profile?.employeeId) {
      const status = getCurrentStatus(user.profile.employeeId);
      console.log('Status updated:', status);
      setIsCheckedIn(status.isCheckedIn);
      setTodayRecord(status.todayRecord);
    }
  };

  const handleCheckIn = async () => {
    if (user?.profile?.employeeId && !isLoading) {
      setIsLoading(true);
      try {
        const result = await checkIn(user.profile.employeeId);
        console.log('Check-in result:', result);

        if (result.success) {
          setIsCheckedIn(true);
          setTodayRecord(result.record);
          // Force update status after a brief delay
          setTimeout(updateStatus, 100);
        } else {
          alert(result.message || 'Check-in failed');
        }
      } catch (error) {
        console.error('Check-in error:', error);
        alert('Check-in failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCheckOut = async () => {
    if (user?.profile?.employeeId && !isLoading) {
      setIsLoading(true);
      try {
        const result = await checkOut(user.profile.employeeId);
        console.log('Check-out result:', result);

        if (result.success) {
          setIsCheckedIn(false);
          setTodayRecord(result.record);
          // Force update status after a brief delay
          setTimeout(updateStatus, 100);
        } else {
          alert(result.message || 'Check-out failed');
        }
      } catch (error) {
        console.error('Check-out error:', error);
        alert('Check-out failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAMPM = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const calculateWorkedHours = () => {
    if (!todayRecord || !todayRecord.checkIn) return '0h 0m';

    const checkInTime = new Date(`${todayRecord.date}T${todayRecord.checkIn}`);
    const endTime = todayRecord.checkOut 
      ? new Date(`${todayRecord.date}T${todayRecord.checkOut}`)
      : new Date();

    const diffMs = endTime - checkInTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="modern-time-clock">
      <Card className="time-clock-card">
        <div className="clock-header">
          <h2>Time Clock</h2>
          <div className={`status-badge ${isCheckedIn ? 'status-checked-in' : 'status-checked-out'}`}>
            <div className="status-dot"></div>
            {isCheckedIn ? 'Checked In' : 'Checked Out'}
          </div>
        </div>

        <div className="digital-clock">
          <div className="time-display">
            {formatTime(currentTime)}
          </div>
          <div className="ampm-display">
            {formatTimeAMPM(currentTime)}
          </div>
          <div className="date-display">
            {formatDate(currentTime)}
          </div>
        </div>

        <div className="work-summary">
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-label">Check In</div>
              <div className="summary-value">
                {todayRecord?.checkIn || '--:--'}
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-label">Check Out</div>
              <div className="summary-value">
                {todayRecord?.checkOut || '--:--'}
              </div>
            </div>

            <div className="summary-card highlight">
              <div className="summary-label">Hours Today</div>
              <div className="summary-value hours-value">
                {calculateWorkedHours()}
              </div>
            </div>
          </div>
        </div>

        <div className="clock-actions">
          {!isCheckedIn ? (
            <Button 
              variant="success" 
              className="clock-btn clock-btn-checkin"
              onClick={handleCheckIn}
              disabled={isLoading}
            >
              <span className="btn-icon">🕐</span>
              <span className="btn-text">{isLoading ? 'Checking In...' : 'Check In'}</span>
            </Button>
          ) : (
            <Button 
              variant="danger" 
              className="clock-btn clock-btn-checkout"
              onClick={handleCheckOut}
              disabled={isLoading}
            >
              <span className="btn-icon">🕐</span>
              <span className="btn-text">{isLoading ? 'Checking Out...' : 'Check Out'}</span>
            </Button>
          )}
        </div>

        {/* Debug info - remove in production */}
        <div style={{padding: '10px', fontSize: '12px', color: '#666', borderTop: '1px solid #eee'}}>
          Debug: Status={isCheckedIn ? 'In' : 'Out'}, Record={todayRecord ? 'Yes' : 'No'}
        </div>
      </Card>
    </div>
  );
};

export default TimeClockWidget;