import { TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/components/StatCard.css'; // Ensure correct import path

const StatCard = ({
    title,
    value,
    icon: Icon, // eslint-disable-line no-unused-vars
    trend,
    trendLabel,
    onClick
}) => {
    const isPositive = trend > 0;

    return (
        <div
            className={`stat-card ${onClick ? 'stat-card-clickable' : ''}`}
            onClick={onClick}
        >
            <div className="stat-card-top">
                <div className="stat-card-title">{title}</div>
                <div className="stat-card-icon">
                    <Icon size={20} />
                </div>
            </div>
            <div className="stat-card-value">{value}</div>
            {(trend !== undefined || trendLabel) && (
                <div className="stat-card-bottom">
                    {trend !== undefined && (
                        <div className={`stat-card-trend ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{Math.abs(trend).toFixed(1)}%</span>
                        </div>
                    )}
                    {trendLabel && (
                        <div className="stat-card-label">{trendLabel}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatCard;
