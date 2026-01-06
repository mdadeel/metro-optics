import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';

const AdminPayments = () => {
    return (
        <div style={{ padding: '20px' }}>
            <div className="wp-page-header">
                <h1 className="wp-page-title">Payments</h1>
            </div>

            <div className="wp-card" style={{ marginTop: '20px', textAlign: 'center', padding: '80px 20px' }}>
                <CreditCard size={64} style={{ color: 'var(--wp-blue)', margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--wp-text)' }}>
                    Payment Management
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--wp-text-light)', marginBottom: '24px' }}>
                    Coming Soon
                </p>
                <button className="wp-button-primary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                    <DollarSign size={16} />
                    View Transactions
                </button>
            </div>
        </div>
    );
};

export default AdminPayments;
