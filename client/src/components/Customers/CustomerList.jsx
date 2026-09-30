import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';
import { CustomerModal } from './CustomerModal';
import { Search, Plus, Edit2, Trash2, Users, Mail, Phone, Filter } from 'lucide-react';

export const CustomerList = () => {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers({
        search,
        status: statusFilter,
      });
      setCustomers(data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (customerData) => {
    if (editingCustomer) {
      await customerService.updateCustomer(editingCustomer._id, customerData);
      showToast('Customer profile updated successfully');
    } else {
      await customerService.createCustomer(customerData);
      showToast('New customer added successfully');
    }
    fetchCustomers();
  };

  const handleDeleteCustomer = async (id, name) => {
    if (!isAdmin) {
      showToast('Only Admin users can delete customer records', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      try {
        await customerService.deleteCustomer(id);
        showToast('Customer record deleted successfully');
        fetchCustomers();
      } catch (err) {
        showToast(err.message || 'Delete failed', 'error');
      }
    }
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
          <h2>Customers Directory</h2>
          <p>Manage customer contacts, details, and account statuses</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Controls Bar */}
      <div className="controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
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
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-card shadow-sm">
        {loading ? (
          <div className="table-loader">
            <div className="spinner-lg"></div>
            <p>Loading customers directory...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} className="empty-icon" />
            <h3>No customers found</h3>
            <p>Try clearing your search query or add a new customer to get started.</p>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} /> Add First Customer
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div className="product-name-cell">
                        <div className="product-avatar">
                          {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <span className="font-weight-600">{customer.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <Mail size={14} className="text-subtle" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <Phone size={14} className="text-subtle" />
                        <span>{customer.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          customer.status === 'Active' ? 'status-in-stock' : 'status-out-of-stock'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-action-edit"
                          onClick={() => handleOpenEditModal(customer)}
                          title="Edit Customer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={`btn-icon btn-action-delete ${
                            !isAdmin ? 'disabled' : ''
                          }`}
                          onClick={() => handleDeleteCustomer(customer._id, customer.name)}
                          title={isAdmin ? 'Delete Customer' : 'Admin only feature'}
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

      {/* Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customerToEdit={editingCustomer}
      />
    </div>
  );
};
