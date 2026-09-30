import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export const AuthModal = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-logo">
            <TrendingUp size={28} color="#ffffff" />
          </div>
          <h1 className="brand-name">SalesPulse</h1>
          <span className="brand-tagline">Sales & Analytics Platform</span>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <div className="auth-body">
          {activeTab === 'login' ? (
            <Login onSwitchToRegister={() => setActiveTab('register')} />
          ) : (
            <Register onSwitchToLogin={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
};
