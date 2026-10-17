import { useState } from 'react';
import { CaretDown as ChevronDown } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../lib/seo';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "Ordering & Payment",
            questions: [
                {
                    q: "How do I place an order?",
                    a: "Browse the collection, choose any frame and lens options shown on the product page, then add them to your bag. At checkout, enter your delivery details, choose an available payment method, and review the full order summary before placing your order."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "Payment choices appear during checkout and may depend on your delivery address. Current options include credit or debit card, PayPal, and cash on delivery where available."
                },
                {
                    q: "Can I cancel or modify my order?",
                    a: "Yes, you can cancel or modify your order within 2 hours of placement by contacting our support team. After that, the order is sent to production and cannot be modified."
                }
            ]
        },
        {
            category: "Prescriptions & Lenses",
            questions: [
                {
                    q: "Do I need a prescription to order glasses?",
                    a: "Only prescription lenses require a valid prescription from an eye-care professional. The product page shows the lens choices currently available for each frame; contact us before ordering if you need prescription lenses."
                },
                {
                    q: "How do I submit my prescription?",
                    a: "You can save prescription details under Prescriptions in your account. The checkout form does not currently collect a prescription upload or prescription values, so contact support before placing an order that needs prescription lenses."
                },
                {
                    q: "What is PD (Pupillary Distance) and how do I measure it?",
                    a: "PD is the distance between your pupils, measured in millimeters. It may be printed on your prescription; otherwise, ask your eye-care professional to measure it. We do not currently offer an online PD calculator."
                },
                {
                    q: "What lens options do you offer?",
                    a: "Available selections vary by frame. Product pages currently show options such as clear, polarized anti-glare, blue-light blocking, and photochromic lenses. Contact us if you need a specific lens type that is not listed."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                {
                    q: "How long does shipping take?",
                    a: "Delivery timing depends on the destination and order. After placing an order, enter its number on the Track an Order page to see the latest status, or contact support if you need an update."
                },
                {
                    q: "How much is shipping?",
                    a: "Shipping is complimentary when your cart subtotal is $99 or more. For smaller orders, standard shipping is $9.99. Your current shipping charge appears in the cart and checkout summary."
                },
                {
                    q: "Do you ship internationally?",
                    a: "Delivery availability depends on the destination supported by checkout. If your address is not accepted or you are ordering from outside the listed delivery areas, contact us before placing an order."
                },
                {
                    q: "How can I track my order?",
                    a: "Open Track an Order and enter the order number from your confirmation. The page shows the latest status recorded for that order; contact support if the number is not found or the status needs clarification."
                },
                {
                    q: "What if my glasses are damaged during shipping?",
                    a: "Keep the packaging, take clear photos of the damage, and contact support as soon as possible. Our team will review the order and explain the available next steps."
                }
            ]
        },
        {
            category: "Returns & Exchanges",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "Metro Optics advertises 30-day returns on the storefront. Eligibility can depend on the item and its condition, so contact support for return instructions before sending anything back."
                },
                {
                    q: "How do I return or exchange my glasses?",
                    a: "Contact us with your order number and the reason for the return. We will confirm whether the item is eligible and share the correct return or exchange instructions."
                },
                {
                    q: "Are there any restocking fees?",
                    a: "Any applicable fees or shipping adjustments will be confirmed with your return instructions. Please contact support before returning your order."
                }
            ]
        },
        {
            category: "Product Information",
            questions: [
                {
                    q: "How do I choose the right frame size?",
                    a: "Choose from the frame sizes listed on each product page. If measurements are not available or you are unsure which fit to choose, contact our team before ordering."
                },
                {
                    q: "What materials are your frames made of?",
                    a: "Frame materials and product specifications are listed on the product page when available. If a detail you need is missing, contact support and include the frame name."
                },
                {
                    q: "Do all frames come with a warranty?",
                    a: "Warranty coverage depends on the frame and its terms. Check the product or order information, or contact support with the frame name or order number to confirm what applies."
                },
                {
                    q: "Can I get prescription lenses in sunglasses?",
                    a: "Prescription availability can vary by frame, and prescription details are not collected during checkout at this time. Contact us before ordering so we can confirm whether your chosen frame can be made with your prescription."
                }
            ]
        },
        {
            category: "Account & Support",
            questions: [
                {
                    q: "Do I need to create an account to order?",
                    a: "You can check out as a guest. An account lets you view your order history, save addresses and prescriptions, and keep your wishlist in one place."
                },
                {
                    q: "How can I contact customer support?",
                    a: "Visit the Contact page for the current phone number, email address, business hours, and contact form. The form prepares an email in your email app, where you can review and send it."
                },
                {
                    q: "Do you have physical stores?",
                    a: "Please use the Contact page to confirm whether in-person consultations or frame trials are currently available in your area."
                }
            ]
        }
    ];

    const faqDescription = 'Find clear answers to common questions about ordering eyewear, prescriptions, lens options, delivery, returns and customer support at Metro Optics.';
    const faqSchema = {
        ...buildWebPageSchema({
            name: 'Eyewear & Order FAQs | Metro Optics',
            description: faqDescription,
            path: '/faq',
            type: 'FAQPage',
        }),
        mainEntity: faqs.flatMap((category) => category.questions.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        }))),
    };

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    return (
        <div className="faq-page">
            <SEO
                title="Eyewear & Order FAQs"
                description={faqDescription}
                url="/faq"
                structuredData={[
                    faqSchema,
                    buildBreadcrumbSchema([
                        { name: 'Home', path: '/' },
                        { name: 'FAQs', path: '/faq' },
                    ]),
                ]}
            />
            <div className="faq-container">
                <Breadcrumb items={[{ label: 'Help & FAQs' }]} />
                <div className="faq-header">
                    <p className="mo-eyebrow">GOOD TO KNOW</p>
                    <h1 className="faq-title">Frequently asked questions</h1>
                    <p className="faq-subtitle">
                        Find answers to common questions about ordering, prescriptions, shipping, and more
                    </p>
                </div>

                <div className="faq-content">
                    {faqs.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="faq-category">
                            <h2 className="faq-category-title">{category.category}</h2>
                            <div className="faq-questions">
                                {category.questions.map((item, questionIndex) => {
                                    const key = `${categoryIndex}-${questionIndex}`;
                                    const isOpen = openIndex === key;
                                    const buttonId = `faq-btn-${key}`;
                                    const panelId = `faq-panel-${key}`;

                                    return (
                                        <div key={questionIndex} className="faq-item">
                                            <button
                                                id={buttonId}
                                                type="button"
                                                onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                                className="faq-question"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                            >
                                                <span className="faq-question-text">{item.q}</span>
                                                <ChevronDown
                                                    className={`faq-icon ${isOpen ? 'open' : ''}`}
                                                    size={20}
                                                    aria-hidden="true"
                                                />
                                            </button>
                                            <div
                                                id={panelId}
                                                role="region"
                                                aria-labelledby={buttonId}
                                                className={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`}
                                                hidden={!isOpen}
                                            >
                                                <p>{item.a}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-footer">
                    <h3 className="faq-footer-title">Still have questions?</h3>
                    <p className="faq-footer-text">
                        Our support team is here to help. Contact us anytime!
                    </p>
                    <Link to="/contact" className="faq-contact-btn">
                        Contact support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
