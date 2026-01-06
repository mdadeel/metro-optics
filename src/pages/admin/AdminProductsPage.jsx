import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import {
    Package, Plus, Search, Edit2, Trash2, Eye, AlertCircle,
    Filter, Download, Upload, X, ChevronDown
} from 'lucide-react';
import usePagination from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { useToast } from '../../hooks/useToast';
import { products as localSeedData } from '../../data/products';
import './AdminProductsPage.css';

const AdminProductsPage = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { addToast, ToastContainer } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        description: ''
    });

    // Get unique categories
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category))];
        return cats;
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesStock = stockFilter === 'all' ||
                (stockFilter === 'low' && product.stock < 10) ||
                (stockFilter === 'out' && product.stock === 0) ||
                (stockFilter === 'in' && product.stock > 0);

            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [products, searchTerm, categoryFilter, stockFilter]);

    // Pagination
    const {
        currentData: paginatedProducts,
        currentPage,
        totalPages,
        goToPage
    } = usePagination(filteredProducts, 10);

    // Handle product selection
    const toggleProduct = (id) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(p => p.id));
        }
    };

    // Modal handlers
    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', stock: '', image: '', description: '' });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image,
            description: product.description || ''
        });
        setShowModal(true);
    };

    // FIX: Made async and await the operations before showing success
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submission
        if (isLoading) return;
        setIsLoading(true);

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                addToast('Product updated successfully!', 'success');
            } else {
                await addProduct({ ...formData, id: Date.now(), rating: 0 });
                addToast('Product added successfully!', 'success');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving product:', error);
            addToast('Failed to save product', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // FIX: Made async and await the delete before showing success
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                addToast('Product deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting product:', error);
                addToast('Failed to delete product', 'error');
            }
        }
    };

    // FIX: Made async and use Promise.all for bulk operations
    const handleBulkDelete = async () => {
        if (confirm(`Delete ${selectedProducts.length} selected products?`)) {
            setIsLoading(true);
            try {
                await Promise.all(selectedProducts.map(id => deleteProduct(id)));
                addToast(`${selectedProducts.length} products deleted!`, 'success');
                setSelectedProducts([]);
            } catch (error) {
                console.error('Error bulk deleting products:', error);
                addToast('Some products failed to delete', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSeedDatabase = async () => {
        if (products.length > 0) {
            if (!confirm(`Database already has ${products.length} products. Add more?`)) return;
        }

        setIsLoading(true);
        let count = 0;
        try {
            // Create 3 variants for each local product to get ~48 items
            const variants = ['Classic', 'Special Edition', 'Premium'];

            for (const baseProduct of localSeedData) {
                for (let i = 0; i < 3; i++) {
                    const variantLabel = variants[i];
                    const seedProduct = {
                        ...baseProduct,
                        name: `${baseProduct.name} (${variantLabel})`,
                        price: baseProduct.price + (i * 200),
                        stock: Math.floor(Math.random() * 40) + 5,
                        tags: [...(baseProduct.tags || []), variantLabel.toLowerCase()],
                        createdAt: new Date().toISOString()
                    };

                    // addProduct handles ID removal
                    await addProduct(seedProduct);
                    count++;
                }
            }
            addToast(`Successfully added ${count} products!`, 'success');
        } catch (error) {
            console.error("Seeding error:", error);
            addToast("Failed to seed database", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="products-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">Products</h1>
                    <p className="page-subtitle">{filteredProducts.length} products total</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary" onClick={handleSeedDatabase} disabled={isLoading}>
                        <Upload size={18} />
                        {isLoading ? 'Seeding...' : 'Seed Database'}
                    </button>
                    <button className="btn-primary" onClick={openAddModal} disabled={isLoading}>
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                >
                    <option value="all">All Stock</option>
                    <option value="in">In Stock</option>
                    <option value="low">Low Stock (&lt;10)</option>
                    <option value="out">Out of Stock</option>
                </select>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
                <div className="bulk-actions-bar">
                    <span className="selected-count">
                        {selectedProducts.length} selected
                    </span>
                    <button className="btn-danger-outline" onClick={handleBulkDelete} disabled={isLoading}>
                        <Trash2 size={16} />
                        {isLoading ? 'Deleting...' : 'Delete Selected'}
                    </button>
                </div>
            )}

            {/* Products Table */}
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th style={{ width: '120px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => toggleProduct(product.id)}
                                    />
                                </td>
                                <td>
                                    <div className="product-cell">
                                        <img src={product.image} alt={product.name} className="product-thumb" />
                                        <div>
                                            <div className="product-name-cell">{product.name}</div>
                                            {product.rating && (
                                                <div className="product-rating-cell">⭐ {product.rating}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td className="price-cell">৳{product.price}</td>
                                <td>
                                    <span className={`stock-badge ${product.stock === 0 ? 'out' :
                                        product.stock < 10 ? 'low' : 'in'
                                        }`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${product.stock > 0 ? 'active' : 'inactive'}`}>
                                        {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-icon"
                                            onClick={() => openEditModal(product)}
                                            title="Edit"
                                            disabled={isLoading}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn-icon btn-danger"
                                            onClick={() => handleDelete(product.id)}
                                            title="Delete"
                                            disabled={isLoading}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="empty-state">
                        <Package size={48} />
                        <p>No products found</p>
                    </div>
                )}

                {filteredProducts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                    />
                )}
            </div>

            <ToastContainer />

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !isLoading && setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="modal-close" onClick={() => !isLoading && setShowModal(false)} disabled={isLoading}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter product name"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="e.g., Eyeglasses"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (৳) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        placeholder="0"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        placeholder="0"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Image URL *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Product description..."
                                    rows="3"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={isLoading}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;
