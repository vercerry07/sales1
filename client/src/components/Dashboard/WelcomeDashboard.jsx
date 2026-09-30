import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Shield, User, Key, Database, Layers, ArrowRight } from 'lucide-react';

export const WelcomeDashboard = () => {
  const { user, isAdmin, token } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Hello, {user?.name}! 👋</h1>
          <p>
            You are successfully authenticated via JWT as a{' '}
            <strong className="text-highlight">{user?.role}</strong>.
          </p>
        </div>
        <div className="auth-status-pill">
          <CheckCircle2 size={18} className="pill-icon text-success" />
          <span>MongoDB Atlas Connected & Authenticated</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* User Card */}
        <div className="card shadow-sm">
          <div className="card-header">
            <h3>Account Profile</h3>
          </div>
          <div className="card-body">
            <div className="profile-row">
              <span className="profile-label">Full Name:</span>
              <span className="profile-val">{user?.name}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email:</span>
              <span className="profile-val">{user?.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Assigned Role:</span>
              <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-sales'}`}>
                {isAdmin ? <Shield size={14} /> : <User size={14} />}
                {user?.role}
              </span>
            </div>
            <div className="profile-row">
              <span className="profile-label">User ID:</span>
              <span className="profile-val code-text">{user?._id}</span>
            </div>
          </div>
        </div>

        {/* Role Permissions Card */}
        <div className="card shadow-sm">
          <div className="card-header">
            <h3>Role & Permissions Scope</h3>
          </div>
          <div className="card-body">
            {isAdmin ? (
              <div className="permissions-list">
                <div className="permission-item text-success">
                  <CheckCircle2 size={16} /> <span>Full access to View, Add, Edit, Delete Products</span>
                </div>
                <div className="permission-item text-success">
                  <CheckCircle2 size={16} /> <span>Full access to View, Add, Edit, Delete Customers</span>
                </div>
                <div className="permission-item text-success">
                  <CheckCircle2 size={16} /> <span>Create, Filter & View all Sales & Financial Reports</span>
                </div>
                <div className="permission-item text-success">
                  <CheckCircle2 size={16} /> <span>Full Dashboard Analytics & Performance KPIs</span>
                </div>
              </div>
            ) : (
              <div className="permissions-list">
                <div className="permission-item text-success">
                  <CheckCircle2 size={16} /> <span>View Products & Check Inventory</span>
                </div>
                <div className="permission-item text-success">
                  <CheckCircle2 size={16} /> <span>View & Create Customer Records</span>
                </div>
                <div className="permission-item text-success">
                  <CheckCircle2 size={16} /> <span>Create New Sales Orders</span>
                </div>
                <div className="permission-item text-muted">
                  <span className="dot-restricted">🔒</span> <span>Restricted: Cannot delete records or view full financials</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Token Verification Card */}
        <div className="card shadow-sm card-full">
          <div className="card-header">
            <h3>
              <Key size={18} /> Active JWT Session Payload
            </h3>
          </div>
          <div className="card-body">
            <p className="section-desc">
              Your session is secured using standard Bearer Token authentication. Below is your current active JWT token string:
            </p>
            <div className="token-box">
              <code>{token || 'Token active in localStorage'}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
