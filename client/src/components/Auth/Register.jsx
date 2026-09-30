import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Lock, AlertCircle, Shield, UserCheck } from 'lucide-react';

export const Register = ({ onSwitchToLogin }) => {
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Sales User');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!name || !email || !password) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, role);
    setLoading(false);
    if (!res.success) {
      setLocalError(res.error);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Register to start managing sales and analytics</p>
      </div>

      {(localError || error) && (
        <div className="alert alert-danger">
          <AlertCircle className="alert-icon" size={18} />
          <span>{localError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="reg-name">Full Name</label>
          <div className="input-with-icon">
            <User className="input-icon" size={18} />
            <input
              id="reg-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email Address</label>
          <div className="input-with-icon">
            <Mail className="input-icon" size={18} />
            <input
              id="reg-email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Select User Role</label>
          <div className="role-selector">
            <label className={`role-option ${role === 'Sales User' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="Sales User"
                checked={role === 'Sales User'}
                onChange={() => setRole('Sales User')}
              />
              <UserCheck size={16} />
              <span>Sales User</span>
            </label>

            <label className={`role-option ${role === 'Admin' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={role === 'Admin'}
                onChange={() => setRole('Admin')}
              />
              <Shield size={16} />
              <span>Admin</span>
            </label>
          </div>
          <p className="field-hint">
            {role === 'Admin'
              ? '⚡ Admin role gets full access to view, edit, and delete products, customers & sales.'
              : '🔒 Sales User role has restricted access based on permissions.'}
          </p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="reg-confirm"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? (
            <span className="spinner-sm"></span>
          ) : (
            <>
              <UserPlus size={18} /> Create Account
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button type="button" className="btn-link" onClick={onSwitchToLogin}>
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
};
