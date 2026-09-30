import React from 'react';
import { X, FileText, User, Calendar, Shield, Package, DollarSign } from 'lucide-react';

export const SaleDetailModal = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <h3>
            <FileText size={20} /> Order Invoice — {sale.orderNumber}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body invoice-body">
          {/* Top Invoice Metadata */}
          <div className="invoice-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Customer Details</span>
              <span className="meta-val font-weight-600">{sale.customer?.name || 'N/A'}</span>
              <span className="meta-sub">{sale.customer?.email}</span>
              <span className="meta-sub">{sale.customer?.phone}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Salesperson</span>
              <span className="meta-val">{sale.salesperson?.name || 'N/A'}</span>
              <span className="meta-sub">{sale.salesperson?.role}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Order Date</span>
              <span className="meta-val">{formatDate(sale.createdAt)}</span>
              <span className="meta-sub">
                Status:{' '}
                <strong
                  className={`status-pill status-${sale.status?.toLowerCase()}`}
                  style={{ display: 'inline-block', marginTop: '4px' }}
                >
                  {sale.status}
                </strong>
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="invoice-items-card">
            <h4>Ordered Items</h4>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Item</th>
                  <th>Unit Price ($)</th>
                  <th>Qty</th>
                  <th className="text-right">Subtotal ($)</th>
                </tr>
              </thead>
              <tbody>
                {sale.items?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="product-name-cell">
                        <Package size={16} className="text-subtle" />
                        <span className="font-weight-600">{item.name}</span>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td className="text-right font-weight-600">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="invoice-grand-total">
            <span className="grand-label">Grand Total:</span>
            <span className="grand-val">${sale.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
