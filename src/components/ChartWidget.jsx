import { useMemo } from 'react';
import './ChartWidget.css';

const ChartWidget = ({ title, data, type = 'line', height = 200 }) => {
    // Calculate chart dimensions
    const max = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
    const min = useMemo(() => Math.min(...data.map(d => d.value)), [data]);
    const range = max - min || 1;

    // Generate SVG path for line chart
    const linePath = useMemo(() => {
        if (type !== 'line' || data.length === 0) return '';

        const width = 100;
        const stepX = width / (data.length - 1 || 1);

        return data.map((point, i) => {
            const x = i * stepX;
            const y = height - ((point.value - min) / range * (height - 20)) - 10;
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');
    }, [data, type, height, min, range]);

    // Generate bars for bar chart
    const bars = useMemo(() => {
        if (type !== 'bar') return [];

        const barWidth = 100 / data.length * 0.8;
        const gap = 100 / data.length * 0.2;

        return data.map((point, i) => {
            const barHeight = (point.value / max) * (height - 30);
            const x = (i * (barWidth + gap));
            const y = height - barHeight - 10;

            return { ...point, x, y, width: barWidth, height: barHeight };
        });
    }, [data, type, height, max]);

    return (
        <div className="chart-widget">
            <div className="chart-widget-header">
                <h3 className="chart-widget-title">{title}</h3>
            </div>

            <div className="chart-widget-body">
                <svg
                    className="chart-svg"
                    viewBox={`0 0 100 ${height}`}
                    preserveAspectRatio="none"
                >
                    {type === 'line' && (
                        <>
                            {/* Area fill */}
                            <path
                                d={`${linePath} L 100,${height} L 0,${height} Z`}
                                className="chart-area"
                            />
                            {/* Line */}
                            <path
                                d={linePath}
                                className="chart-line"
                            />
                            {/* Points */}
                            {data.map((point, i) => {
                                const x = (i / (data.length - 1 || 1)) * 100;
                                const y = height - ((point.value - min) / range * (height - 20)) - 10;
                                return (
                                    <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r="2"
                                        className="chart-point"
                                    />
                                );
                            })}
                        </>
                    )}

                    {type === 'bar' && bars.map((bar, i) => (
                        <rect
                            key={i}
                            x={`${bar.x}%`}
                            y={bar.y}
                            width={`${bar.width}%`}
                            height={bar.height}
                            className="chart-bar"
                            rx="2"
                        />
                    ))}
                </svg>

                {/* Labels */}
                <div className="chart-labels">
                    {data.map((point, i) => (
                        <div key={i} className="chart-label">
                            <span className="chart-label-text">{point.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChartWidget;
