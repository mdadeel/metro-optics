import { Envelope as Mail, Phone, MapPin, Clock, PaperPlaneTilt as Send, WarningCircle as AlertCircle, NavigationArrow, ArrowSquareOut, Buildings, Globe } from "@phosphor-icons/react";
import { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import SEO from '../components/SEO';
import Breadcrumb from '../components/layout/Breadcrumb';
import { SITE_CONFIG } from '../lib/constants';
import { buildBreadcrumbSchema, buildWebPageSchema, SITE_ORIGIN } from '../lib/seo';

const Contact = () => {
    const { settings, getPage } = useSiteSettings();
    const pageContent = getPage('contact');
    const contactPhone = settings.sitePhone || SITE_CONFIG.phone;
    const supportEmail = settings.siteEmail || SITE_CONFIG.email;
    const contactAddress = settings.siteAddress || SITE_CONFIG.address;
    const businessHours = settings.businessHours || SITE_CONFIG.workingHours;
    const contactPageTitle = pageContent?.title || 'Contact Metro Optics';
    const contactDescription = 'Contact Metro Optics — Optical Wholesaler in Chattogram. Reach out for eyewear wholesale, frames, orders, address directions and customer service.';
    const contactPageSchema = {
        ...buildWebPageSchema({
            name: contactPageTitle,
            description: contactDescription,
            path: '/contact',
            type: 'ContactPage',
        }),
        mainEntity: {
            '@type': 'LocalBusiness',
            '@id': `${SITE_ORIGIN}/#organization`,
            name: 'Metro Optics',
            description: 'Optical wholesaler and precision eyewear supplier located in Chattogram, Bangladesh.',
            url: SITE_CONFIG.website,
            telephone: SITE_CONFIG.phoneIntl,
            email: supportEmail,
            address: {
                '@type': 'PostalAddress',
                streetAddress: '151, Shultan market, 9 Sheikh Mujib Rd',
                addressLocality: 'Chattogram',
                postalCode: '4000',
                addressCountry: 'BD',
            },
            hasMap: SITE_CONFIG.googleMapsUrl,
            openingHours: 'Mo-Su 09:00-22:00',
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support & wholesale inquiries',
                telephone: contactPhone,
                email: supportEmail,
            },
        },
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
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

    const mailtoHref = `mailto:${supportEmail}?subject=${encodeURIComponent(`Metro Optics: ${formData.subject.trim()}`)}&body=${encodeURIComponent(`From: ${formData.name.trim()}\nReply to: ${formData.email.trim()}\n\n${formData.message.trim()}`)}`;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, subject: true, message: true });
        if (!validateForm()) return;

        // The storefront has no message API configured yet. Open a prefilled
        // email instead of showing a false "sent" confirmation.
        setSubmitted(true);
        window.location.href = mailtoHref;
    };

    return (
        <div className="contact-page">
            <SEO
                title="Contact & Customer Support"
                description={contactDescription}
                url="/contact"
                structuredData={[
                    contactPageSchema,
                    buildBreadcrumbSchema([
                        { name: 'Home', path: '/' },
                        { name: 'Contact', path: '/contact' },
                    ]),
                ]}
            />
            <div className="contact-container">
                <Breadcrumb items={[{ label: 'Contact' }]} />
                {/* Header */}
                <div className="contact-header">
                    <p className="mo-eyebrow">WE’RE HERE TO HELP</p>
                    <h1 className="contact-title">{contactPageTitle}</h1>
                    <p className="contact-subtitle">
                        Need help choosing frames or checking an order? Use the details here or prepare an email below. Your email app will open so you can review and send your message.
                    </p>
                </div>

                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info">
                        <div className="contact-profile-header">
                            <span className="contact-badge-wholesale">Optical wholesaler</span>
                            <span className="contact-badge-status">Open · Closes 10 PM</span>
                        </div>
                        <h2 className="contact-info-title">Metro Optics</h2>
                        <p className="contact-info-desc">
                            Optical wholesaler & precision eyewear supplier in Chattogram. Visit our wholesale showroom or reach out directly for frame distribution, optical lens orders, and business inquiries.
                        </p>

                        <div className="contact-quick-actions">
                            <a
                                href={SITE_CONFIG.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="contact-action-btn contact-action-btn--primary"
                            >
                                <NavigationArrow size={16} weight="bold" />
                                <span>Directions</span>
                            </a>
                            <a
                                href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                                className="contact-action-btn"
                            >
                                <Phone size={16} weight="bold" />
                                <span>Call</span>
                            </a>
                            <a
                                href={SITE_CONFIG.googleBusinessUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="contact-action-btn"
                                title="Manage your Business Profile on Google"
                            >
                                <ArrowSquareOut size={16} weight="bold" />
                                <span>Profile</span>
                            </a>
                        </div>

                        <div className="contact-methods">
                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <MapPin size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Address</h3>
                                    <p className="contact-method-text">{contactAddress}</p>
                                    <span className="contact-meta-sub">Plus Code: {SITE_CONFIG.plusCode}</span>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <Clock size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Business Hours</h3>
                                    <p className="contact-method-text">{businessHours}</p>
                                    <span className="contact-meta-sub">{SITE_CONFIG.fullHours}</span>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <Phone size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Phone</h3>
                                    <a className="contact-method-text" href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}>{contactPhone}</a>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <Globe size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Website</h3>
                                    <a className="contact-method-text" href={SITE_CONFIG.website} target="_blank" rel="noreferrer">metro-optics.vercel.app</a>
                                </div>
                            </div>

                            <div className="contact-method">
                                <div className="contact-method-icon">
                                    <Mail size={24} />
                                </div>
                                <div className="contact-method-content">
                                    <h3 className="contact-method-title">Email</h3>
                                    <a className="contact-method-text" href={`mailto:${supportEmail}`}>{supportEmail}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-wrapper">
                        <h2 className="contact-form-title">Send us a Message</h2>

                        {submitted ? (
                            <div className="contact-success" role="status" aria-live="polite">
                                <div className="contact-success-icon">
                                    <Send size={24} aria-hidden="true" />
                                </div>
                                <h3 className="contact-success-title">Your email draft is ready</h3>
                                <p className="contact-success-text">
                                    Your email app should open with your message. Review it and press Send; if it doesn’t open, use the email link below.
                                </p>
                                <div className="contact-success-actions">
                                    <a className="contact-form-submit" href={mailtoHref}>Open email app</a>
                                    <a className="contact-success-email" href={`mailto:${supportEmail}`}>{supportEmail}</a>
                                    <button type="button" className="contact-success-reset" onClick={() => setSubmitted(false)}>Edit message</button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form" noValidate>
                                <div className="contact-form-group">
                                    <label htmlFor="name" className="contact-form-label">Your Name</label>
                                    <input
                                        type="text"
                                        autoComplete="name"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('name')}
                                        className={`contact-form-input ${touched.name && fieldErrors.name ? 'input-error' : ''}`}
                                        placeholder="John Doe"
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
                                        autoComplete="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('email')}
                                        className={`contact-form-input ${touched.email && fieldErrors.email ? 'input-error' : ''}`}
                                        placeholder="john@example.com"
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
                                        maxLength={120}
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
                                        maxLength={1600}
                                        aria-invalid={touched.message && fieldErrors.message ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                                    />
                                    <p className="contact-character-count">{formData.message.length} / 1,600 characters</p>
                                    {touched.message && fieldErrors.message && (
                                        <div id="message-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.message}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="contact-form-submit">
                                    <Send size={16} aria-hidden="true" />
                                    Prepare email
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
