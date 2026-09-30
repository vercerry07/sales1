import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { ProductModal } from './ProductModal';
import { Search, Plus, Edit2, Trash2, Package, Tag, DollarSign, ShieldAlert, Filter } from 'lucide-react';

export const ProductList = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        search,
        category: categoryFilter,
        status: statusFilter,
      });
      setProducts(data);

      // Extract unique categories
      const cats = Array.from(new Set(data.map((p) => p.category).filter(Boolean)));
      setCategories(cats);
    } catch (err) {
      showToast(err.message || 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, statusFilter]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await productService.updateProduct(editingProduct._id, productData);
      showToast('Product updated successfully');
    } else {
      await productService.createProduct(productData);
      showToast('Product created successfully');
    }
    fetchProducts();
  };

  const handleDeleteProduct = async (id, name) => {
    if (!isAdmin) {
      showToast('Only Admin users can delete products', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productService.deleteProduct(id);
        showToast('Product deleted successfully');
        fetchProducts();
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
          <h2>Products Directory</h2>
          <p>Manage product catalog, pricing, and stock status</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Controls Bar */}
      <div className="controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-select-wrapper">
            <Filter size={16} className="filter-icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Stock Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-card shadow-sm">
        {loading ? (
          <div className="table-loader">
            <div className="spinner-lg"></div>
            <p>Loading products catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-icon" />
            <h3>No products found</h3>
            <p>Try clearing your search filters or add a new product to get started.</p>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} /> Create First Product
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price ($)</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-name-cell">
                        <div className="product-avatar">
                          <Package size={18} />
                        </div>
                        <span className="font-weight-600">{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">
                        <Tag size={12} /> {product.category}
                      </span>
                    </td>
                    <td>
                      <span className="price-tag">${product.price.toFixed(2)}</span>
                    </td>
                    <td>
                      <span
                        className={`status-pill status-${product.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-action-edit"
                          onClick={() => handleOpenEditModal(product)}
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={`btn-icon btn-action-delete ${
                            !isAdmin ? 'disabled' : ''
                          }`}
                          onClick={() => handleDeleteProduct(product._id, product.name)}
                          title={isAdmin ? 'Delete Product' : 'Admin only feature'}
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
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
};
