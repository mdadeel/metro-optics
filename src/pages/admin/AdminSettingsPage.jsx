import { useState } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useToast } from '../../hooks/useToast';
import { Settings, Save, Globe, Mail, Phone, MapPin, Clock, DollarSign, Package, Database } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import initialProducts from '../../data/products';
import './AdminSettingsPage.css';

const AdminSettingsPage = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addToast, ToastContainer } = useToast();
    const [formData, setFormData] = useState({
        siteName: settings.siteName || 'Metro Optics',
        siteEmail: settings.siteEmail || 'info@metrooptics.com',
        sitePhone: settings.sitePhone || '+880 1234-567890',
        siteAddress: settings.siteAddress || 'Dhaka, Bangladesh',
        businessHours: settings.businessHours || '9:00 AM - 8:00 PM',
        currency: settings.currency || '৳',
        taxRate: settings.taxRate || 0,
        shippingFee: settings.shippingFee || 0,
        freeShippingThreshold: settings.freeShippingThreshold || 5000
    });

    const [saved, setSaved] = useState(false);
    const [seeding, setSeeding] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setSaved(true);
        addToast('Settings saved successfully!', 'success');
        setTimeout(() => setSaved(false), 3000);
    };

    const handleSeedDatabase = async () => {
        if (!confirm("This will upload initial products to the database. Continue?")) return;
        
        setSeeding(true);
        try {
            const productsRef = collection(db, 'products');
            const snapshot = await getDocs(productsRef);

            if (!snapshot.empty) {
                addToast('Database already contains data. Clear it first if you want to re-seed.', 'error');
                setSeeding(false);
                return;
            }

            const batch = writeBatch(db);
            initialProducts.forEach(product => {
                const docRef = doc(productsRef); // Create a new doc with auto ID
                // Or use product.id as the key if you want: const docRef = doc(db, 'products', product.id);
                // Let's stick to auto ID for Firestore best practices, but keep the product.id in the data field.
                batch.set(docRef, product);
            });

            await batch.commit();
            addToast(`Successfully added ${initialProducts.length} products!`, 'success');
        } catch (error) {
            console.error("Seeding failed:", error);
            addToast('Failed to seed database: ' + error.message, 'error');
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="settings-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <Settings size={28} />
                        Site Settings
                    </h1>
                    <p className="page-subtitle">Manage your store configuration and preferences</p>
                </div>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSubmit} className="settings-form">
                {/* General Settings */}
                <div className="settings-section">
                    <h3 className="section-title">
                        <Globe size={20} />
                        General Information
                    </h3>
                    <div className="settings-grid">
                        <div className="form-field">
                            <label>Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={formData.siteName}
                                onChange={handleChange}
                                placeholder="Metro Optics"
                            />
                        </div>
                        <div className="form-field">
                            <label>Currency Symbol</label>
                            <input
                                type="text"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                placeholder="৳"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="settings-section">
                    <h3 className="section-title">
                        <Mail size={20} />
                        Contact Information
                    </h3>
                    <div className="settings-grid">
                        <div className="form-field">
                            <label>
                                <Mail size={16} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="siteEmail"
                                value={formData.siteEmail}
                                onChange={handleChange}
                                placeholder="info@metrooptics.com"
                            />
                        </div>
                        <div className="form-field">
                            <label>
                                <Phone size={16} />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="sitePhone"
                                value={formData.sitePhone}
                                onChange={handleChange}
                                placeholder="+880 1234-567890"
                            />
                        </div>
                        <div className="form-field full-width">
                            <label>
                                <MapPin size={16} />
                                Business Address
                            </label>
                            <input
                                type="text"
                                name="siteAddress"
                                value={formData.siteAddress}
                                onChange={handleChange}
                                placeholder="Dhaka, Bangladesh"
                            />
                        </div>
                        <div className="form-field">
                            <label>
                                <Clock size={16} />
                                Business Hours
                            </label>
                            <input
                                type="text"
                                name="businessHours"
                                value={formData.businessHours}
                                onChange={handleChange}
                                placeholder="9:00 AM - 8:00 PM"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing Settings */}
                <div className="settings-section">
                    <h3 className="section-title">
                        <DollarSign size={20} />
                        Pricing & Shipping
                    </h3>
                    <div className="settings-grid">
                        <div className="form-field">
                            <label>Tax Rate (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={formData.taxRate}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="0"
                            />
                        </div>
                        <div className="form-field">
                            <label>Default Shipping Fee ({formData.currency})</label>
                            <input
                                type="number"
                                name="shippingFee"
                                value={formData.shippingFee}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                placeholder="0"
                            />
                        </div>
                        <div className="form-field">
                            <label>Prescription Base Price ({formData.currency})</label>
                            <input
                                type="number"
                                name="prescriptionPrice"
                                value={formData.prescriptionPrice || 500}
                                onChange={handleChange}
                                min="0"
                                step="50"
                                placeholder="500"
                            />
                        </div>
                        <div className="form-field">
                            <label>Free Shipping Threshold ({formData.currency})</label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={formData.freeShippingThreshold}
                                onChange={handleChange}
                                min="0"
                                step="100"
                                placeholder="5000"
                            />
                            <small style={{ fontSize: '12px', color: '#6b7280' }}>
                                Free shipping for orders above this amount
                            </small>
                        </div>
                    </div>
                </div>

                {/* Database Tools */}
                <div className="settings-section">
                    <h3 className="section-title">
                        <Database size={20} />
                        Database Management
                    </h3>
                    <div className="settings-grid">
                        <div className="form-field full-width">
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1rem' }}>
                                Use this to populate the database with initial product data. Only use if the product list is empty.
                            </p>
                            <button 
                                type="button" 
                                onClick={handleSeedDatabase} 
                                className="btn-save" 
                                disabled={seeding}
                                style={{ background: seeding ? '#9ca3af' : 'var(--color-primary)' }}
                            >
                                {seeding ? 'Seeding...' : 'Seed Products Database'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="settings-footer">
                    {saved && (
                        <div className="save-success">
                            ✓ Settings saved successfully!
                        </div>
                    )}
                    <button type="submit" className="btn-save">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </form>

            <ToastContainer />
        </div>
    );
};

export default AdminSettingsPage;
