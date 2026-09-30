import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Tag, CheckCircle2 } from 'lucide-react';

export const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('In Stock');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || '');
      setPrice(productToEdit.price !== undefined ? String(productToEdit.price) : '');
      setStatus(productToEdit.status || 'In Stock');
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setStatus('In Stock');
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !category.trim() || price === '') {
      setError('Please fill out all required fields.');
      return;
    }

    if (isNaN(price) || Number(price) < 0) {
      setError('Please enter a valid non-negative price.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        status,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>
            <Package size={20} />
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="prod-name">Product Name *</label>
            <div className="input-with-icon">
              <Package className="input-icon" size={18} />
              <input
                id="prod-name"
                type="text"
                placeholder="e.g. Wireless Noise-Canceling Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-category">Category *</label>
              <div className="input-with-icon">
                <Tag className="input-icon" size={18} />
                <input
                  id="prod-category"
                  type="text"
                  placeholder="e.g. Electronics, Furniture"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prod-price">Price ($) *</label>
              <div className="input-with-icon">
                <DollarSign className="input-icon" size={18} />
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prod-status">Stock Status</label>
            <select
              id="prod-status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner-sm"></span> : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
