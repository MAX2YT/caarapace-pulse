import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password, formData.role);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🦀</span>
            <h1>Caarapace Pulse</h1>
          </div>
          <p>Employee Management System</p>
        </div>
        
        <div className="login-tabs">
          <button
            className={`tab-btn ${formData.role === 'employee' ? 'active' : ''}`}
            onClick={() => handleRoleChange('employee')}
          >
            Employee Login
          </button>
          <button
            className={`tab-btn ${formData.role === 'hr' ? 'active' : ''}`}
            onClick={() => handleRoleChange('hr')}
          >
            HR Login
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="btn--full-width"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Employee: john.doe / password123</p>
            <p>HR: jane.smith / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;