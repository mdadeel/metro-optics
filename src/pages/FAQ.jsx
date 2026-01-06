import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "Ordering & Payment",
            questions: [
                {
                    q: "How do I place an order?",
                    a: "Browse our collection, select your favorite frames, choose your lens options, and proceed to checkout. You'll need to upload your prescription or enter it manually during the checkout process."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit/debit cards, mobile banking (bKash, Nagad, Rocket), and cash on delivery for orders within Dhaka."
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
                    a: "Yes, for prescription eyeglasses you'll need a valid prescription from an eye doctor. For non-prescription sunglasses or blue light glasses, no prescription is required."
                },
                {
                    q: "How do I submit my prescription?",
                    a: "You can upload a photo of your prescription during checkout, manually enter the details, or email it to us at prescriptions@metrooptics.com."
                },
                {
                    q: "What is PD (Pupillary Distance) and how do I measure it?",
                    a: "PD is the distance between your pupils in millimeters. It's crucial for proper lens alignment. You can find it on your prescription, ask your eye doctor, or use our online PD calculator tool."
                },
                {
                    q: "What lens options do you offer?",
                    a: "We offer single vision, bifocal, and progressive lenses. Additional options include anti-glare coating, blue light filtering, photochromic (transitions), and various tint options."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                {
                    q: "How long does shipping take?",
                    a: "Standard shipping takes 3-5 business days nationwide. Express shipping (1-2 days) is available for Dhaka and major cities at an additional cost."
                },
                {
                    q: "Do you ship internationally?",
                    a: "Currently, we only ship within Bangladesh. International shipping will be available soon."
                },
                {
                    q: "How can I track my order?",
                    a: "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order on our Track Order page using your order ID."
                },
                {
                    q: "What if my glasses are damaged during shipping?",
                    a: "All orders are insured. If your glasses arrive damaged, contact us within 48 hours with photos and we'll send a replacement at no cost."
                }
            ]
        },
        {
            category: "Returns & Exchanges",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We offer a 7-day return policy from the date of delivery. Glasses must be in original condition with all packaging. Prescription glasses are eligible for return if there's a manufacturing defect."
                },
                {
                    q: "How do I return or exchange my glasses?",
                    a: "Contact our support team to initiate a return. We'll provide you with a return shipping label. Once we receive and inspect the glasses, we'll process your refund or exchange."
                },
                {
                    q: "Are there any restocking fees?",
                    a: "No, we don't charge restocking fees. However, original shipping costs are non-refundable unless the return is due to our error."
                }
            ]
        },
        {
            category: "Product Information",
            questions: [
                {
                    q: "How do I choose the right frame size?",
                    a: "Each product page includes detailed measurements (lens width, bridge width, temple length). We also provide a size guide to help you find the perfect fit based on your face shape."
                },
                {
                    q: "What materials are your frames made of?",
                    a: "We offer frames in various materials including acetate, metal (stainless steel, titanium), TR-90 plastic, and combination materials. Each product description specifies the frame material."
                },
                {
                    q: "Do all frames come with a warranty?",
                    a: "Yes, all frames come with a 1-year warranty against manufacturing defects. Lenses are covered for 6 months against scratches (with proper care)."
                },
                {
                    q: "Can I get prescription lenses in sunglasses?",
                    a: "Absolutely! All our sunglasses can be fitted with prescription lenses. Simply upload your prescription during checkout and select your preferred lens options."
                }
            ]
        },
        {
            category: "Account & Support",
            questions: [
                {
                    q: "Do I need to create an account to order?",
                    a: "No, you can checkout as a guest. However, creating an account allows you to save prescriptions, track orders easily, and access exclusive member benefits."
                },
                {
                    q: "How can I contact customer support?",
                    a: "You can reach us via email at support@metrooptics.com, call +880 1234-567890, or use the contact form on our website. We respond within 24 hours."
                },
                {
                    q: "Do you have physical stores?",
                    a: "Currently, we operate primarily online. However, you can visit our showroom in Dhaka by appointment for in-person consultations and frame trials."
                }
            ]
        }
    ];

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    return (
        <div className="faq-page">
            <div className="faq-container">
                <div className="faq-header">
                    <h1 className="faq-title">Frequently Asked Questions</h1>
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

                                    return (
                                        <div key={questionIndex} className="faq-item">
                                            <button
                                                onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                                className="faq-question"
                                                aria-expanded={isOpen}
                                            >
                                                <span className="faq-question-text">{item.q}</span>
                                                <ChevronDown
                                                    className={`faq-icon ${isOpen ? 'open' : ''}`}
                                                    size={20}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="faq-answer">
                                                    <p>{item.a}</p>
                                                </div>
                                            )}
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
                    <a href="/contact" className="faq-contact-btn">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
