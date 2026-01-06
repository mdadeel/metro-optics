import { Award, Truck, Shield, Headphones } from 'lucide-react';

const WhyChooseUs = () => {
    const features = [
        {
            icon: Award,
            title: 'Premium Quality',
            description: 'Hand-picked frames from top brands. Every pair is inspected for quality before shipping.'
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Nationwide shipping within 3-5 business days. Track your order every step of the way.'
        },
        {
            icon: Shield,
            title: '7-Day Returns',
            description: 'Not satisfied? Return your glasses within 7 days for a full refund. No questions asked.'
        },
        {
            icon: Headphones,
            title: 'Expert Support',
            description: 'Our certified opticians are here to help you choose the right frames and lenses.'
        }
    ];

    return (
        <section className="why-choose-us">
            <div className="why-choose-us-container">
                <div className="why-choose-us-header">
                    <h2 className="why-choose-us-title">Why Choose Metro Optics?</h2>
                    <p className="why-choose-us-subtitle">
                        Your vision, our priority - delivering excellence in every pair
                    </p>
                </div>

                <div className="why-choose-us-grid">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="why-choose-us-card">
                                <div className="why-choose-us-icon-wrapper">
                                    <Icon className="why-choose-us-icon" size={32} />
                                </div>
                                <h3 className="why-choose-us-card-title">{feature.title}</h3>
                                <p className="why-choose-us-card-description">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
