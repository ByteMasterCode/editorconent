import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { ChartSettings } from './ChartSettings';
import { BarChart3, PieChart, LineChart, TrendingUp, Activity } from 'lucide-react';

export const Chart = ({
                          type = 'bar',
                          data = [
                              { label: 'Jan', value: 65, value2: 45 },
                              { label: 'Feb', value: 59, value2: 55 },
                              { label: 'Mar', value: 80, value2: 65 },
                              { label: 'Apr', value: 81, value2: 70 },
                              { label: 'May', value: 56, value2: 60 },
                              { label: 'Jun', value: 55, value2: 50 }
                          ],
                          title = 'Sample Chart',
                          width = 500,
                          height = 300,
                          borderRadius = 12,
                          margin = [0, 0, 0, 0],
                          backgroundColor = '#ffffff',
                          primaryColor = '#3b82f6',
                          secondaryColor = '#10b981',
                          showLegend = true,
                          showGrid = true,
                          animated = true
                      }) => {
    const { connectors: { connect, drag }, selected, actions: { setProp } } = useNode((state) => ({
        selected: state.events.selected
    }));

    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState('');

    const handleMouseDown = (direction) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = width;
        const startHeight = height;

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;

            if (direction.includes('right')) {
                newWidth = Math.max(300, startWidth + deltaX);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(200, startHeight + deltaY);
            }

            setProp((props) => {
                props.width = newWidth;
                props.height = newHeight;
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeDirection('');
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const getHandleStyle = (direction) => {
        const isActive = isResizing && resizeDirection === direction;
        return {
            width: '8px',
            height: '8px',
            background: isActive ? '#3b82f6' : '#2563eb',
            border: '2px solid white',
            borderRadius: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            cursor: getCursor(direction),
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: isActive ? 'none' : 'all 0.15s ease',
            zIndex: 10
        };
    };

    const getCursor = (direction) => {
        const cursors = {
            'bottom-right': 'se-resize',
            'right': 'e-resize',
            'bottom': 's-resize'
        };
        return cursors[direction] || 'default';
    };

    const renderChart = () => {
        const maxValue = Math.max(...data.map(d => Math.max(d.value, d.value2 || 0)));
        const chartHeight = height - 80;
        const chartWidth = width - 80;

        switch (type) {
            case 'bar':
                return (
                    <div className="flex items-end justify-center gap-2 h-full px-4">
                        {data.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-1">
                                <div className="flex gap-1">
                                    <div
                                        className={`rounded-t transition-all duration-500 ${animated ? 'animate-pulse' : ''}`}
                                        style={{
                                            backgroundColor: primaryColor,
                                            height: `${(item.value / maxValue) * (chartHeight - 40)}px`,
                                            width: '20px'
                                        }}
                                    />
                                    {item.value2 && (
                                        <div
                                            className={`rounded-t transition-all duration-500 ${animated ? 'animate-pulse' : ''}`}
                                            style={{
                                                backgroundColor: secondaryColor,
                                                height: `${(item.value2 / maxValue) * (chartHeight - 40)}px`,
                                                width: '20px'
                                            }}
                                        />
                                    )}
                                </div>
                                <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                );

            case 'line':
                return (
                    <div className="relative h-full p-4">
                        <svg width="100%" height="100%" className="overflow-visible">
                            {showGrid && (
                                <defs>
                                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                                    </pattern>
                                </defs>
                            )}
                            {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

                            <polyline
                                fill="none"
                                stroke={primaryColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={data.map((item, index) =>
                                    `${(index / (data.length - 1)) * (chartWidth - 40) + 20},${chartHeight - 40 - (item.value / maxValue) * (chartHeight - 80)}`
                                ).join(' ')}
                                className={animated ? 'animate-pulse' : ''}
                            />

                            {data.map((item, index) => (
                                <circle
                                    key={index}
                                    cx={(index / (data.length - 1)) * (chartWidth - 40) + 20}
                                    cy={chartHeight - 40 - (item.value / maxValue) * (chartHeight - 80)}
                                    r="4"
                                    fill={primaryColor}
                                    className={animated ? 'animate-pulse' : ''}
                                />
                            ))}
                        </svg>

                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
                            {data.map((item, index) => (
                                <span key={index} className="text-xs text-gray-600 font-medium">{item.label}</span>
                            ))}
                        </div>
                    </div>
                );

            case 'pie':
            case 'doughnut': {
                const total = data.reduce((sum, item) => sum + item.value, 0);
                let currentAngle = 0;
                const centerX = chartWidth / 2;
                const centerY = chartHeight / 2;
                const radius = Math.min(centerX, centerY) - 20;
                const innerRadius = type === 'doughnut' ? radius * 0.6 : 0;

                return (
                    <div className="flex items-center justify-center h-full">
                        <svg width={chartWidth} height={chartHeight}>
                            {data.map((item, index) => {
                                const angle = (item.value / total) * 360;
                                const startAngle = currentAngle;
                                const endAngle = currentAngle + angle;
                                currentAngle += angle;

                                const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
                                const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
                                const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
                                const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

                                const largeArcFlag = angle > 180 ? 1 : 0;

                                const pathData = [
                                    `M ${centerX} ${centerY}`,
                                    `L ${x1} ${y1}`,
                                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                    'Z'
                                ].join(' ');

                                const colors = [primaryColor, secondaryColor, '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                                const color = colors[index % colors.length];

                                return (
                                    <path
                                        key={index}
                                        d={pathData}
                                        fill={color}
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                        className={animated ? 'animate-pulse' : ''}
                                    />
                                );
                            })}

                            {type === 'doughnut' && (
                                <circle
                                    cx={centerX}
                                    cy={centerY}
                                    r={innerRadius}
                                    fill={backgroundColor}
                                />
                            )}
                        </svg>
                    </div>
                );
            }

            default:
                return <div className="flex items-center justify-center h-full text-gray-500">Chart type not supported</div>;
        }
    };

    const getChartIcon = () => {
        switch (type) {
            case 'bar': return BarChart3;
            case 'line': return LineChart;
            case 'pie':
            case 'doughnut': return PieChart;
            case 'area': return Activity;
            default: return TrendingUp;
        }
    };

    const ChartIcon = getChartIcon();

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            className={`transition-all duration-200 relative ${selected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                width: `${width}px`,
                height: `${height}px`,
            }}
            onClick={e => e.stopPropagation()}
        >
            <div
                className="w-full h-full rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                style={{
                    borderRadius: `${borderRadius}px`,
                    backgroundColor
                }}
            >
                <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ChartIcon className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{type} chart</div>
                </div>

                <div className="relative" style={{ height: 'calc(100% - 60px)' }}>
                    {renderChart()}
                </div>

                {showLegend && (
                    <div className="absolute bottom-2 left-4 right-4 flex flex-wrap gap-3">
                        <div className="flex items-center gap-1">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <span className="text-xs text-gray-600">Series 1</span>
                        </div>
                        {data.some(d => d.value2) && (
                            <div className="flex items-center gap-1">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: secondaryColor }}
                                />
                                <span className="text-xs text-gray-600">Series 2</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selected && (
                <>
                    <div
                        style={{ ...getHandleStyle('bottom-right'), bottom: 0, right: 0 }}
                        onMouseDown={handleMouseDown('bottom-right')}
                    />
                    <div
                        style={{ ...getHandleStyle('right'), right: 0, top: '50%' }}
                        onMouseDown={handleMouseDown('right')}
                    />
                    <div
                        style={{ ...getHandleStyle('bottom'), bottom: 0, left: '50%' }}
                        onMouseDown={handleMouseDown('bottom')}
                    />
                </>
            )}
        </div>
    );
};

Chart.craft = {
    displayName: 'Chart',
    props: {
        type: 'bar',
        data: [
            { label: 'Jan', value: 65, value2: 45 },
            { label: 'Feb', value: 59, value2: 55 },
            { label: 'Mar', value: 80, value2: 65 },
            { label: 'Apr', value: 81, value2: 70 },
            { label: 'May', value: 56, value2: 60 },
            { label: 'Jun', value: 55, value2: 50 }
        ],
        title: 'Sample Chart',
        width: 500,
        height: 300,
        borderRadius: 12,
        margin: [0, 0, 0, 0],
        backgroundColor: '#ffffff',
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        showLegend: true,
        showGrid: true,
        animated: true
    },
    related: {
        settings: ChartSettings
    }
};
