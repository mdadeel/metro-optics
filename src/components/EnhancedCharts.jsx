import './EnhancedCharts.css';

const EnhancedLineChart = ({ title, data, color = '#2563eb' }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
        <div className="enhanced-chart-card">
            <div className="enhanced-chart-header">
                <h3>{title}</h3>
                <div className="chart-value-display">
                    <span className="current-value">৳{data[data.length - 1]?.value.toLocaleString()}</span>
                    <span className="trend-badge positive">+12.5%</span>
                </div>
            </div>

            <div className="chart-container">
                <svg className="enhanced-line-chart" viewBox="0 0 100 40" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="10" x2="100" y2="10" className="grid-line" />
                    <line x1="0" y1="20" x2="100" y2="20" className="grid-line" />
                    <line x1="0" y1="30" x2="100" y2="30" className="grid-line" />

                    {/* Area gradient */}
                    <defs>
                        <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
                            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>

                    {/* Area path */}
                    <path
                        d={`
                            M ${data.map((point, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y = 35 - ((point.value - minValue) / range * 25);
                            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                        }).join(' ')}
                            L 100,40 L 0,40 Z
                        `}
                        fill={`url(#gradient-${title})`}
                    />

                    {/* Line path */}
                    <path
                        d={data.map((point, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y = 35 - ((point.value - minValue) / range * 25);
                            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                        className="chart-line-path"
                    />

                    {/* Data points */}
                    {data.map((point, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 35 - ((point.value - minValue) / range * 25);
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="0.8"
                                fill={color}
                                className="chart-point"
                            />
                        );
                    })}
                </svg>

                {/* X-axis labels */}
                <div className="chart-labels">
                    {data.map((point, i) => (
                        <div key={i} className="chart-label">{point.label}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EnhancedBarChart = ({ title, data }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

    return (
        <div className="enhanced-chart-card">
            <div className="enhanced-chart-header">
                <h3>{title}</h3>
                <div className="chart-legend">
                    {data.map((item, i) => (
                        <div key={i} className="legend-item">
                            <span className="legend-dot" style={{ background: colors[i % colors.length] }}></span>
                            <span className="legend-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bar-chart-container">
                <div className="bars-wrapper">
                    {data.map((item, i) => {
                        const percentage = (item.value / maxValue) * 100;
                        return (
                            <div key={i} className="bar-item">
                                <div className="bar-info">
                                    <span className="bar-label">{item.label}</span>
                                    <span className="bar-value">৳{item.value.toLocaleString()}</span>
                                </div>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${percentage}%`,
                                            background: colors[i % colors.length]
                                        }}
                                    >
                                        <span className="bar-percentage">{percentage.toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export { EnhancedLineChart, EnhancedBarChart };
