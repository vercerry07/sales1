import React, { useState, useEffect } from 'react';
import { saleService } from '../../services/saleService';
import { useAuth } from '../../context/AuthContext';
import { SaleModal } from './SaleModal';
import { SaleDetailModal } from './SaleDetailModal';
import { Search, Plus, Eye, Trash2, ShoppingBag, Filter, Calendar } from 'lucide-react';

export const SaleList = () => {
  const { isAdmin } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await saleService.getSales({
        search,
        status: statusFilter,
      });
      setSales(data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch sales orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [search, statusFilter]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateSale = async (saleData) => {
    await saleService.createSale(saleData);
    showToast('New sale order placed successfully');
    fetchSales();
  };

  const handleStatusChange = async (saleId, newStatus) => {
    try {
      await saleService.updateSaleStatus(saleId, newStatus);
      showToast(`Order status updated to '${newStatus}'`);
      fetchSales();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteSale = async (id, orderNumber) => {
    if (!isAdmin) {
      showToast('Only Admin users can delete sale orders', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete order "${orderNumber}"?`)) {
      try {
        await saleService.deleteSale(id);
        showToast('Sale order deleted successfully');
        fetchSales();
      } catch (err) {
        showToast(err.message || 'Delete failed', 'error');
      }
    }
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {notification && (
        <div className={`toast-notification toast-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Sales & Orders Directory</h2>
          <p>Track sales orders, customer transactions, and order fulfillment</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} /> Create New Sale
        </button>
      </div>

      {/* Controls Bar */}
      <div className="controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. ORD-1001) or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-select-wrapper">
            <Filter size={16} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Order Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-card shadow-sm">
        {loading ? (
          <div className="table-loader">
            <div className="spinner-lg"></div>
            <p>Loading sales orders...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>No sales orders found</h3>
            <p>Try clearing your search query or create a new sale order to populate transactions.</p>
            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} /> Create First Sale
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items Summary</th>
                  <th>Total Amount ($)</th>
                  <th>Salesperson</th>
                  <th>Date</th>
                  <th>Order Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>
                      <span className="code-text font-weight-600">{sale.orderNumber}</span>
                    </td>
                    <td>
                      <div className="user-details">
                        <span className="font-weight-600">{sale.customer?.name || 'N/A'}</span>
                        <span className="user-email">{sale.customer?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">
                        {sale.items?.length || 0} Item(s)
                      </span>
                    </td>
                    <td>
                      <span className="price-tag">${sale.totalAmount?.toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="user-email">{sale.salesperson?.name || 'System'}</span>
                    </td>
                    <td>
                      <span className="contact-cell">
                        <Calendar size={14} className="text-subtle" />
                        {formatDate(sale.createdAt)}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`status-pill-select status-${sale.status?.toLowerCase()}`}
                        value={sale.status}
                        onChange={(e) => handleStatusChange(sale._id, e.target.value)}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-action-edit"
                          onClick={() => handleViewDetails(sale)}
                          title="View Invoice Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`btn-icon btn-action-delete ${
                            !isAdmin ? 'disabled' : ''
                          }`}
                          onClick={() => handleDeleteSale(sale._id, sale.orderNumber)}
                          title={isAdmin ? 'Delete Order' : 'Admin only feature'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <SaleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSale}
      />

      {/* Invoice Detail Modal */}
      <SaleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        sale={selectedSale}
      />
    </div>
  );
};
