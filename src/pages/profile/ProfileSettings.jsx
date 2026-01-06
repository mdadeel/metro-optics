import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'sonner';
import { User, Mail, Phone, Lock, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import './ProfilePages.css';
import './ProfileSettings.css';

const ProfileSettings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (activeTab === 'personal') {
            try {
                // Update Auth Profile
                if (user.displayName !== formData.displayName) {
                    await updateProfile(user, {
                        displayName: formData.displayName
                    });
                }

                // Update Firestore Profile
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    name: formData.displayName,
                    phoneNumber: formData.phone
                });

                toast.success("Profile updated successfully");
            } catch (error) {
                console.error("Error updating profile:", error);
                toast.error("Failed to update profile");
            }
        }
        else if (activeTab === 'security') {
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("New passwords do not match");
                return;
            }
            if (formData.newPassword.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }

            try {
                // Re-auth is often required for password change
                // For simplicity, we try direct update first
                await updatePassword(user, formData.newPassword);
                toast.success("Password changed successfully");
                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            } catch (error) {
                console.error("Error changing password:", error);
                if (error.code === 'auth/requires-recent-login') {
                    toast.error("Please logout and login again to change password");
                } else {
                    toast.error(error.message || "Failed to change password");
                }
            }
        }
    };

    return (
        <div className="profile-settings-page">
            <div className="profile-header">
                <h1>Profile Settings</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            {/* Settings Container */}
            <div className="settings-container">
                {/* Tabs */}
                <div className="settings-tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="settings-content">
                    {/* Personal Info Tab */}
                    {activeTab === 'personal' && (
                        <form onSubmit={handleSubmit} className="settings-form-grid">
                            <h3 className="settings-section-title">Personal Information</h3>

                            <div className="form-field">
                                <label className="settings-label">
                                    <User size={16} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    className="settings-input"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="form-field">
                                <label className="settings-label">
                                    <Mail size={16} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="settings-input"
                                />
                            </div>

                            <div className="form-field full-width">
                                <label className="settings-label">
                                    <Phone size={16} /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="settings-input"
                                    placeholder="+880 1700000000"
                                />
                            </div>
                            <button type="submit" className="settings-save-btn">
                                Save Changes
                            </button>
                        </form>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleSubmit} className="settings-form-grid">
                            <h3 className="settings-section-title">Change Password</h3>

                            <div className="form-field password-field">
                                <label className="settings-label">
                                    <Lock size={16} /> Current Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="settings-input"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle-btn"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div className="form-field">
                                <label className="settings-label">
                                    <Lock size={16} /> New Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="settings-input"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="form-field">
                                <label className="settings-label">
                                    <Lock size={16} /> Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="settings-input"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button type="submit" className="settings-save-btn">
                                Update Password
                            </button>
                        </form>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div>
                            <h3 className="settings-section-title">Notification Preferences</h3>

                            <div className="notification-list">
                                {[
                                    { label: 'Order Updates', desc: 'Get notified about your order status' },
                                    { label: 'Promotions', desc: 'Receive special offers and discounts' },
                                    { label: 'New Arrivals', desc: 'Be the first to know about new products' },
                                    { label: 'Price Drops', desc: 'Get alerts when wishlist items go on sale' }
                                ].map((item, idx) => (
                                    <div key={idx} className="notification-item">
                                        <div className="notification-label">
                                            <h4>{item.label}</h4>
                                            <p>{item.desc}</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="notification-checkbox" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
