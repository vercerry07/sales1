import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart2,
  Clock,
  ArrowUpRight,
  Shield,
  User,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardOverview = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('[DashboardOverview Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="table-loader">
        <div className="spinner-lg"></div>
        <p>Loading Sales Analytics & Metrics...</p>
      </div>
    );
  }

  const kpis = stats?.kpis || { totalSales: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 };
  const salesOverTime = stats?.salesOverTime || [];
  const salesByProduct = stats?.salesByProduct || [];
  const statusBreakdown = stats?.orderStatusBreakdown || [];
  const recentSales = stats?.recentSales || [];

  return (
    <div className="dashboard-page-container">
      {/* Top Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Sales Performance Summary</h1>
          <p>
            Logged in as <strong className="text-highlight">{user?.name}</strong> ({user?.role})
          </p>
        </div>
        <div className="auth-status-pill">
          <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-sales'}`}>
            {isAdmin ? <Shield size={14} /> : <User size={14} />}
            {user?.role} Scope
          </span>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card shadow-sm">
          <div className="kpi-icon-wrapper icon-green">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Revenue</span>
            <span className="kpi-value">${kpis.totalSales?.toFixed(2)}</span>
            <span className="kpi-trend text-success">
              <ArrowUpRight size={14} /> Completed Sales
            </span>
          </div>
        </div>

        <div className="kpi-card shadow-sm">
          <div className="kpi-icon-wrapper icon-indigo">
            <ShoppingBag size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Orders</span>
            <span className="kpi-value">{kpis.totalOrders}</span>
            <span className="kpi-sub">All transactions</span>
          </div>
        </div>

        <div className="kpi-card shadow-sm">
          <div className="kpi-icon-wrapper icon-cyan">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Customers</span>
            <span className="kpi-value">{kpis.totalCustomers}</span>
            <span className="kpi-sub">Active client list</span>
          </div>
        </div>

        <div className="kpi-card shadow-sm">
          <div className="kpi-icon-wrapper icon-amber">
            <Package size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Products</span>
            <span className="kpi-value">{kpis.totalProducts}</span>
            <span className="kpi-sub">Catalog items</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Sales Over Time Line/Area Chart */}
        <div className="card chart-card shadow-sm">
          <div className="card-header">
            <h3>
              <TrendingUp size={18} /> Sales Revenue Over Time
            </h3>
          </div>
          <div className="card-body chart-body">
            {salesOverTime.length === 0 ? (
              <div className="chart-empty">No sales history recorded yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={salesOverTime}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Donut Breakdown */}
        <div className="card chart-card shadow-sm">
          <div className="card-header">
            <h3>
              <PieChartIcon size={18} /> Order Status Distribution
            </h3>
          </div>
          <div className="card-body chart-body flex-center">
            {statusBreakdown.every((s) => s.value === 0) ? (
              <div className="chart-empty">No order status data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="status-legend">
              {statusBreakdown.map((s) => (
                <div key={s.name} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: s.color }}></span>
                  <span className="legend-name">{s.name}:</span>
                  <span className="legend-val">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales by Product Bar Chart */}
        <div className="card chart-card shadow-sm">
          <div className="card-header">
            <h3>
              <BarChart2 size={18} /> Revenue by Top Products
            </h3>
          </div>
          <div className="card-body chart-body">
            {salesByProduct.length === 0 ? (
              <div className="chart-empty">No product sales recorded yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={salesByProduct}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="card chart-card shadow-sm">
          <div className="card-header">
            <h3>
              <Clock size={18} /> Recent Orders Ticker
            </h3>
          </div>
          <div className="card-body card-body-scroll">
            {recentSales.length === 0 ? (
              <div className="chart-empty">No recent orders placed yet.</div>
            ) : (
              <div className="recent-list">
                {recentSales.map((order) => (
                  <div key={order._id} className="recent-item">
                    <div className="recent-info">
                      <span className="code-text font-weight-600">{order.orderNumber}</span>
                      <span className="recent-cust">{order.customer?.name}</span>
                    </div>
                    <div className="recent-amount">
                      <span className="price-tag">${order.totalAmount?.toFixed(2)}</span>
                      <span className={`status-pill status-${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
