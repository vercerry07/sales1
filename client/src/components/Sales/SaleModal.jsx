import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { customerService } from '../../services/customerService';
import { X, ShoppingBag, User, Plus, Trash2, DollarSign } from 'lucide-react';

export const SaleModal = ({ isOpen, onClose, onSave }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0, subtotal: 0 }]);
  const [status, setStatus] = useState('Completed');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
      setSelectedCustomer('');
      setItems([{ productId: '', quantity: 1, price: 0, subtotal: 0 }]);
      setStatus('Completed');
      setError('');
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    setDataLoading(true);
    try {
      const [custData, prodData] = await Promise.all([
        customerService.getCustomers({ status: 'Active' }),
        productService.getProducts(),
      ]);
      setCustomers(custData);
      setProducts(prodData);

      if (custData.length > 0) {
        setSelectedCustomer(custData[0]._id);
      }
      if (prodData.length > 0) {
        setItems([
          {
            productId: prodData[0]._id,
            quantity: 1,
            price: prodData[0].price,
            subtotal: prodData[0].price,
          },
        ]);
      }
    } catch (err) {
      setError('Failed to load customers or products data');
    } finally {
      setDataLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleProductChange = (index, productId) => {
    const product = products.find((p) => p._id === productId);
    const updated = [...items];
    const price = product ? product.price : 0;
    const quantity = updated[index].quantity || 1;
    updated[index] = {
      productId,
      quantity,
      price,
      subtotal: price * quantity,
    };
    setItems(updated);
  };

  const handleQuantityChange = (index, qty) => {
    const quantity = Math.max(1, parseInt(qty) || 1);
    const updated = [...items];
    const price = updated[index].price || 0;
    updated[index] = {
      ...updated[index],
      quantity,
      subtotal: price * quantity,
    };
    setItems(updated);
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    const defaultProd = products[0];
    setItems([
      ...items,
      {
        productId: defaultProd._id,
        quantity: 1,
        price: defaultProd.price,
        subtotal: defaultProd.price,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCustomer) {
      setError('Please select a customer for this sale.');
      return;
    }

    if (items.length === 0 || items.some((item) => !item.productId)) {
      setError('Please select valid products for all items.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        customerId: selectedCustomer,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        status,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create sale order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <h3>
            <ShoppingBag size={20} /> Create New Sale Order
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {dataLoading ? (
          <div className="table-loader">
            <div className="spinner-lg"></div>
            <p>Loading customers and inventory products...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {/* Customer & Status Selection */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sale-customer">Select Customer *</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <select
                    id="sale-customer"
                    className="form-select pl-icon"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    required
                  >
                    {customers.length === 0 ? (
                      <option value="">No customers available - Please add a customer first</option>
                    ) : (
                      customers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.email})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sale-status">Order Status</label>
                <select
                  id="sale-status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Line Items Section */}
            <div className="items-section">
              <div className="items-header">
                <label>Order Line Items</label>
                <button
                  type="button"
                  className="btn-link font-weight-600"
                  onClick={handleAddItem}
                  disabled={products.length === 0}
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              {products.length === 0 ? (
                <div className="alert alert-danger">
                  No products in catalog. Please add products before creating a sale.
                </div>
              ) : (
                <div className="items-list">
                  {items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-select-group">
                        <select
                          className="form-select"
                          value={item.productId}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                        >
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} — ${p.price.toFixed(2)} ({p.status})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="item-qty-group">
                        <input
                          type="number"
                          min="1"
                          className="form-input-qty"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      </div>

                      <div className="item-subtotal">
                        <span>${item.subtotal.toFixed(2)}</span>
                      </div>

                      <button
                        type="button"
                        className="btn-icon text-danger"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="order-summary-box">
              <span className="summary-title">Total Order Amount:</span>
              <span className="summary-total">${calculateTotal().toFixed(2)}</span>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || customers.length === 0 || products.length === 0}
              >
                {loading ? <span className="spinner-sm"></span> : 'Place Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
