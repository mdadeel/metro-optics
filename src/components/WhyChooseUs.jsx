import { Trophy, Truck, ShieldCheck, Headphones } from '@phosphor-icons/react';
import { motion } from 'motion/react';

const features = [
    {
        icon: Trophy,
        title: 'Premium Quality',
        description: 'Hand-picked frames from top brands. Every pair is inspected for quality before shipping.'
    },
    {
        icon: Truck,
        title: 'Fast Delivery',
        description: 'Nationwide shipping within 3-5 business days. Track your order every step of the way.'
    },
    {
        icon: ShieldCheck,
        title: '7-Day Returns',
        description: 'Not satisfied? Return your glasses within 7 days for a full refund. No questions asked.'
    },
    {
        icon: Headphones,
        title: 'Expert Support',
        description: 'Our certified opticians are here to help you choose the right frames and lenses.'
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 lg:py-28 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                        Why Choose Metro Optics?
                    </h2>
                    <p className="mt-3 text-muted-foreground text-base lg:text-lg max-w-lg mx-auto">
                        Your vision, our priority — delivering excellence in every pair
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#1E3A5F] transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(30,58,95,0.12)] group-hover:-translate-y-1">
                                    <Icon size={26} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
