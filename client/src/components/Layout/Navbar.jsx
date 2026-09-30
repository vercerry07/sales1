import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, LogOut, Shield, User, LayoutDashboard, Package, Users, ShoppingBag } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo-icon">
          <TrendingUp size={22} color="#ffffff" />
        </div>
        <span className="brand-title">SalesPulse</span>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          <span>Products</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <Users size={16} />
          <span>Customers</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <ShoppingBag size={16} />
          <span>Sales</span>
        </button>
      </nav>

      <div className="navbar-user">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-sales'}`}>
          {isAdmin ? <Shield size={14} /> : <User size={14} />}
          {user?.role}
        </span>

        <button onClick={logout} className="btn btn-logout" title="Sign Out">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
