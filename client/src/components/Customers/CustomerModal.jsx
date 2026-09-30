import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, UserCheck } from 'lucide-react';

export const CustomerModal = ({ isOpen, onClose, onSave, customerToEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name || '');
      setEmail(customerToEdit.email || '');
      setPhone(customerToEdit.phone || '');
      setStatus(customerToEdit.status || 'Active');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setStatus('Active');
    }
    setError('');
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>
            <User size={20} />
            {customerToEdit ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="cust-name">Full Name *</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                id="cust-name"
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cust-email">Email Address *</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="cust-email"
                type="email"
                placeholder="sarah.jenkins@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cust-phone">Phone Number *</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  id="cust-phone"
                  type="text"
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cust-status">Account Status</label>
              <select
                id="cust-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner-sm"></span> : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
