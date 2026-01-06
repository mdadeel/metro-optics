import { useState, useEffect } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useProducts } from '../../context/ProductContext';
import { Save, Plus, Trash2, Edit2, X, Image as ImageIcon, FileText, Layers, Upload } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import './AdminCMSFunctional.css';

const AdminCMSFunctional = () => {
    const { settings, updateSettings, updatePage, getPage } = useSiteSettings();
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { addToast, ToastContainer } = useToast();

    const [activeTab, setActiveTab] = useState('hero');
    const [heroForm, setHeroForm] = useState(settings);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isPageModalOpen, setIsPageModalOpen] = useState(false);
    const [editingPageId, setEditingPageId] = useState(null);
    const [pageForm, setPageForm] = useState({ title: '', content: '' });

    const initialProductState = {
        name: '', price: '', category: 'Eyeglasses', image: '', stock: 10, brand: ''
    };
    const [productForm, setProductForm] = useState(initialProductState);

    // Update hero form when settings change (external update)
    useEffect(() => {
        setHeroForm(settings);
    }, [settings]);

    // Hero Banner Save
    const handleHeroSave = (e) => {
        e.preventDefault();
        updateSettings(heroForm);
        addToast('Hero banner updated successfully!', 'success');
    };

    // Product Modal Handlers
    const handleProductSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...productForm,
            price: Number(productForm.price),
            stock: Number(productForm.stock)
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
            addToast('Product updated successfully!', 'success');
        } else {
            addProduct(productData);
            addToast('Product added successfully!', 'success');
        }

        closeModal();
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setProductForm(product);
        } else {
            setEditingProduct(null);
            setProductForm(initialProductState);
        }
        setIsProductModalOpen(true);
    };

    const closeModal = () => {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm(initialProductState);
    };

    // Page Handlers
    const handlePageEdit = (pageId) => {
        const page = getPage(pageId);
        setEditingPageId(pageId);
        setPageForm(page);
        setIsPageModalOpen(true);
    };

    const handlePageSave = () => {
        if (editingPageId) {
            updatePage(editingPageId, pageForm);
            addToast(`${pageForm.title} updated successfully!`, 'success');
            setIsPageModalOpen(false);
        }
    };

    return (
        <div className="cms-functional">
            <ToastContainer />

            {/* Header */}
            <div className="cms-func-header">
                <h1 className="cms-func-title">Content Management</h1>
                <p className="cms-func-subtitle">Manage your site content, products, and media</p>
            </div>

            {/* Tabs */}
            <div className="cms-tabs">
                <button
                    className={`cms-tab ${activeTab === 'hero' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hero')}
                >
                    <ImageIcon size={18} />
                    Hero Banner
                </button>
                <button
                    className={`cms-tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    <Layers size={18} />
                    Products
                </button>
                <button
                    className={`cms-tab ${activeTab === 'pages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pages')}
                >
                    <FileText size={18} />
                    Pages
                </button>
                <button
                    className={`cms-tab ${activeTab === 'media' ? 'active' : ''}`}
                    onClick={() => setActiveTab('media')}
                >
                    <Upload size={18} />
                    Media
                </button>
            </div>

            {/* Tab Content */}
            <div className="cms-tab-content">
                {/* Hero Banner Tab */}
                {activeTab === 'hero' && (
                    <div className="hero-editor">
                        <h2 className="content-heading">Hero Banner Editor</h2>
                        <form onSubmit={handleHeroSave} className="hero-form">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Hero Title</label>
                                    <input
                                        type="text"
                                        value={heroForm.heroTitle || ''}
                                        onChange={e => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                                        placeholder="Enter hero title"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Subtitle</label>
                                    <input
                                        type="text"
                                        value={heroForm.heroSubtitle || ''}
                                        onChange={e => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                                        placeholder="Enter subtitle"
                                    />
                                </div>
                                <div className="form-field full-width">
                                    <label>Banner Image URL</label>
                                    <input
                                        type="text"
                                        value={heroForm.heroImage || ''}
                                        onChange={e => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="hero-preview">
                                <div className="preview-label">Preview</div>
                                <div className="preview-container">
                                    <img src={heroForm.heroImage} alt="Preview" />
                                    <div className="preview-overlay">
                                        <h3>{heroForm.heroTitle}</h3>
                                        <p>{heroForm.heroSubtitle}</p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-save-hero">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="products-manager">
                        <div className="content-header">
                            <h2 className="content-heading">Product Inventory</h2>
                            <button className="btn-add-product" onClick={() => openModal()}>
                                <Plus size={18} />
                                Add Product
                            </button>
                        </div>

                        <div className="products-grid-cms">
                            {products.map((product) => (
                                <div key={product.id} className="product-card-cms">
                                    <img src={product.image} alt={product.name} />
                                    <div className="product-info-cms">
                                        <h4>{product.name}</h4>
                                        <p className="category">{product.category}</p>
                                        <p className="price">৳{product.price}</p>
                                        <div className="product-actions-cms">
                                            <button onClick={() => openModal(product)}>
                                                <Edit2 size={14} />
                                                Edit
                                            </button>
                                            <button
                                                className="btn-delete-cms"
                                                onClick={() => {
                                                    if (confirm('Delete this product?')) {
                                                        deleteProduct(product.id);
                                                        addToast('Product deleted!', 'success');
                                                    }
                                                }}
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pages Tab */}
                {activeTab === 'pages' && (
                    <div className="pages-manager">
                        <h2 className="content-heading">Site Pages</h2>
                        <div className="pages-list">
                            {['about', 'contact', 'privacy', 'terms'].map((pageId) => {
                                const page = getPage(pageId);
                                return (
                                    <div key={pageId} className="page-item">
                                        <FileText size={20} />
                                        <div>
                                            <h4>{page.title}</h4>
                                            <p className="text-sm text-gray-500">/{pageId}</p>
                                        </div>
                                        <button
                                            className="btn-edit-page"
                                            onClick={() => handlePageEdit(pageId)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <div className="media-manager">
                        <h2 className="content-heading">Media Library</h2>
                        <div className="media-upload-zone">
                            <Upload size={48} />
                            <p>Drag and drop images here or click to upload</p>
                            <button className="btn-upload">Choose Files</button>
                        </div>
                        <div className="media-grid">
                            {products.slice(0, 6).map((product) => (
                                <div key={product.id} className="media-item">
                                    <img src={product.image} alt={product.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="modal-overlay-cms" onClick={closeModal}>
                    <div className="modal-content-cms" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-cms">
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={closeModal}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleProductSubmit} className="modal-form-cms">
                            <div className="form-field">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.name}
                                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row-cms">
                                <div className="form-field">
                                    <label>Price (৳)</label>
                                    <input
                                        type="number"
                                        required
                                        value={productForm.price}
                                        onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        required
                                        value={productForm.stock}
                                        onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-field">
                                <label>Category</label>
                                <select
                                    value={productForm.category}
                                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                >
                                    <option value="Eyeglasses">Eyeglasses</option>
                                    <option value="Sunglasses">Sunglasses</option>
                                    <option value="Contact Lenses">Contact Lenses</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Brand/Company</label>
                                <input
                                    type="text"
                                    value={productForm.brand || ''}
                                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                                    placeholder="e.g., Ray-Ban, Oakley"
                                />
                            </div>
                            <div className="form-field">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.image}
                                    onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer-cms">
                                <button type="button" className="btn-cancel-cms" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit-cms">
                                    {editingProduct ? 'Update' : 'Add'} Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Page Editor Modal */}
            {isPageModalOpen && editingPageId && (
                <div className="modal-overlay-cms" onClick={() => setIsPageModalOpen(false)}>
                    <div className="modal-content-cms modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-cms">
                            <h3>Edit Page: {pageForm.title}</h3>
                            <button onClick={() => setIsPageModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="modal-form-cms">
                            <div className="form-field">
                                <label>Page Title</label>
                                <input
                                    type="text"
                                    value={pageForm.title}
                                    onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Page Content</label>
                                <textarea
                                    rows="12"
                                    value={pageForm.content}
                                    onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                                    placeholder="Enter page content here..."
                                    style={{ fontFamily: 'monospace', fontSize: '13px' }}
                                />
                            </div>

                            <div className="modal-footer-cms">
                                <button
                                    type="button"
                                    className="btn-cancel-cms"
                                    onClick={() => setIsPageModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-submit-cms"
                                    onClick={handlePageSave}
                                >
                                    Save Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCMSFunctional;
