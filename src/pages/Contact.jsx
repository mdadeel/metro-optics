import { Mail, Phone, MapPin, Clock, Send, AlertCircle, Loader2 } from 'lucide-react';
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
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validation functions
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        },
        email: (value) => {
            if (!value) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        },
        subject: (value) => {
            if (!value.trim()) return 'Subject is required';
            if (value.trim().length < 3) return 'Subject must be at least 3 characters';
            return '';
        },
        message: (value) => {
            if (!value.trim()) return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            return '';
        }
    };

    const validateForm = () => {
        const errors = {};
        Object.keys(validators).forEach(field => {
            errors[field] = validators[field](formData[field]);
        });
        setFieldErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        if (validators[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: validators[field](formData[field]) }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (touched[name] && validators[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: validators[name](value) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({ name: true, email: true, subject: true, message: true });

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TODO: Integrate with backend/email service
        console.log('Contact form submitted:', formData);
        setIsLoading(false);
        setSubmitted(true);

        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTouched({});
            setFieldErrors({});
        }, 3000);
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
                            <form onSubmit={handleSubmit} className="contact-form" noValidate>
                                <div className="contact-form-group">
                                    <label htmlFor="name" className="contact-form-label">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('name')}
                                        className={`contact-form-input ${touched.name && fieldErrors.name ? 'input-error' : ''}`}
                                        placeholder="John Doe"
                                        disabled={isLoading}
                                        aria-invalid={touched.name && fieldErrors.name ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                                    />
                                    {touched.name && fieldErrors.name && (
                                        <div id="name-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="email" className="contact-form-label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('email')}
                                        className={`contact-form-input ${touched.email && fieldErrors.email ? 'input-error' : ''}`}
                                        placeholder="john@example.com"
                                        disabled={isLoading}
                                        aria-invalid={touched.email && fieldErrors.email ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                    />
                                    {touched.email && fieldErrors.email && (
                                        <div id="email-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="subject" className="contact-form-label">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('subject')}
                                        className={`contact-form-input ${touched.subject && fieldErrors.subject ? 'input-error' : ''}`}
                                        placeholder="How can we help?"
                                        disabled={isLoading}
                                        aria-invalid={touched.subject && fieldErrors.subject ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                                    />
                                    {touched.subject && fieldErrors.subject && (
                                        <div id="subject-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.subject}
                                        </div>
                                    )}
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="message" className="contact-form-label">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('message')}
                                        rows="5"
                                        className={`contact-form-textarea ${touched.message && fieldErrors.message ? 'input-error' : ''}`}
                                        placeholder="Tell us more about your inquiry..."
                                        disabled={isLoading}
                                        aria-invalid={touched.message && fieldErrors.message ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                                    />
                                    {touched.message && fieldErrors.message && (
                                        <div id="message-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.message}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="contact-form-submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} aria-hidden="true" />
                                            Send Message
                                        </>
                                    )}
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
