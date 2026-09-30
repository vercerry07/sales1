import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

export const Login = ({ onSwitchToRegister }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setLocalError(res.error);
    }
  };

  const handleDemoFill = (role) => {
    setLocalError('');
    clearError();
    if (role === 'Admin') {
      setEmail('admin@salesapp.com');
      setPassword('admin123');
    } else {
      setEmail('sales@salesapp.com');
      setPassword('sales123');
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to access your Sales Dashboard</p>
      </div>

      {(localError || error) && (
        <div className="alert alert-danger">
          <AlertCircle className="alert-icon" size={18} />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Quick Demo Credentials */}
      <div className="demo-fill-container">
        <span className="demo-title">Quick Demo Login:</span>
        <div className="demo-buttons">
          <button
            type="button"
            className="btn btn-outline-admin"
            onClick={() => handleDemoFill('Admin')}
          >
            <ShieldCheck size={16} /> Admin Demo
          </button>
          <button
            type="button"
            className="btn btn-outline-sales"
            onClick={() => handleDemoFill('Sales User')}
          >
            <UserCheck size={16} /> Sales User Demo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-with-icon">
            <Mail className="input-icon" size={18} />
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <Lock className="input-icon" size={18} />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? (
            <span className="spinner-sm"></span>
          ) : (
            <>
              <LogIn size={18} /> Sign In
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button type="button" className="btn-link" onClick={onSwitchToRegister}>
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};
