import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizeObject } from '../../lib/sanitize';
import './AddressBook.css';

const AddressBook = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        type: 'Home',
        name: '',
        phone: '',
        address: '',
        isDefault: false
    });

    const fetchAddresses = useCallback(async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().addresses) {
                setAddresses(userDoc.data().addresses);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    }, [user.uid]);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user, fetchAddresses]);

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            // Sanitize input
            const sanitizedData = sanitizeObject(formData);

            const newAddress = {
                id: Date.now().toString(),
                ...sanitizedData
            };

            // If this is default, remove default from others
            let updatedAddresses = [...addresses];
            if (sanitizedData.isDefault) {
                updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
            }

            const finalAddresses = [...updatedAddresses, newAddress];

            await updateDoc(doc(db, 'users', user.uid), {
                addresses: finalAddresses
            });

            setAddresses(finalAddresses);
            setFormData({
                type: 'Home',
                name: '',
                phone: '',
                address: '',
                isDefault: false
            });
            setShowForm(false);
            toast.success("Address added successfully");
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Failed to save address");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this address?")) return;
        try {
            const updatedList = addresses.filter(a => a.id !== id);
            await updateDoc(doc(db, 'users', user.uid), {
                addresses: updatedList
            });
            setAddresses(updatedList);
            toast.success("Address deleted");
        } catch (deleteError) {
            console.error("Error deleting address:", deleteError);
            toast.error("Failed to delete address");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading addresses...</div>;

    return (
        <div className="address-book-page">
            <div className="address-book-header">
                <h1>Address Book</h1>
                <p>Manage your delivery addresses</p>
            </div>

            {/* Addresses Grid */}
            <div className="address-grid">
                {addresses.map((address) => (
                    <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                        {address.isDefault && (
                            <div className="default-badge">
                                <Check size={12} />
                                Default
                            </div>
                        )}

                        <div className="address-header">
                            <span className="address-type">{address.type}</span>
                            <button
                                className="delete-btn-icon"
                                onClick={() => handleDelete(address.id)}
                                title="Delete Address"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="address-content">
                            <h3>{address.name}</h3>
                            <p>{address.address}</p>
                            <p className="address-phone">
                                <MapPin size={16} />
                                {address.phone}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Add New Address Card */}
                <div
                    className="address-card add-new"
                    onClick={() => setShowForm(true)}
                >
                    <div className="add-icon-wrapper">
                        <Plus size={24} />
                    </div>
                    <h3>Add New Address</h3>
                </div>
            </div>

            {/* Address Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Address</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Address Type</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Home</option>
                                    <option>Work</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Recipient Name</label>
                                <input
                                    required
                                    className="w-full border p-2 rounded"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Address</label>
                                <textarea
                                    required
                                    className="w-full border p-2 rounded"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Street, City, Zip"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    required
                                    className="w-full border p-2 rounded"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+880..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                />
                                <label htmlFor="isDefault" className="text-sm">Set as default address</label>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressBook;
