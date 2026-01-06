import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Contact = () => {
    const { settings, getPage } = useSiteSettings();
    const pageContent = getPage('contact');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Integrate with backend/email service
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                {/* Header */}
                <div className="contact-header">
                    <h1 className="contact-title">{pageContent.title}</h1>
                    <p className="contact-subtitle">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info">
                        <h2 className="contact-info-title">Contact Information</h2>
                        <p className="contact-info-desc" style={{ whiteSpace: 'pre-wrap' }}>
                            {pageContent.content}
                        </p>

                        <div className="contact-methods">
                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <Phone size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Phone</h3>
                                    <p className="contact-method-text">{settings.sitePhone || '+880 1234-567890'}</p>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <Mail size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Email</h3>
                                    <p className="contact-method-text">{settings.siteEmail || 'support@metrooptics.com'}</p>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <MapPin size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Address</h3>
                                    <p className="contact-method-text">
                                        {settings.siteAddress || '123 Main Street, Dhaka'}
                                    </p>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <Clock size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Business Hours</h3>
                                    <p className="contact-method-text">{settings.businessHours || '9:00 AM - 8:00 PM'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-wrapper">
                        <h2 className="contact-form-title">Send us a Message</h2>

                        {submitted ? (
                            <div className="contact-success">
                                <div className="contact-success-icon">
                                    <Send size={48} />
                                </div>
                                <h3 className="contact-success-title">Message Sent!</h3>
                                <p className="contact-success-text">
                                    Thank you for contacting us. We'll get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="contact-form-group">
                                    <label htmlFor="name" className="contact-form-label">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="contact-form-input"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="email" className="contact-form-label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="contact-form-input"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="subject" className="contact-form-label">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="contact-form-input"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="message" className="contact-form-label">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="contact-form-textarea"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button type="submit" className="contact-form-submit">
                                    <Send size={20} />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
