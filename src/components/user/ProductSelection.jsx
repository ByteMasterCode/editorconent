import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { ProductSelectionSettings } from './ProductSelectionSettings';
import { ShoppingCart, Star, Check, Package, Crown, Zap } from 'lucide-react';

const SAMPLE_PRODUCTS = [
    {
        id: 'basic',
        name: 'Basic Course Materials',
        description: 'Essential learning resources to get you started with comprehensive study materials and basic support.',
        image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
        price: 29,
        features: ['PDF Materials', 'Basic Support', 'Community Access', '30-day Access'],
        icon: Package
    },
    {
        id: 'premium',
        name: 'Premium Resources',
        description: 'Advanced learning package with interactive content, priority support, and extended access.',
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        price: 79,
        features: ['All Basic Features', 'Video Tutorials', 'Priority Support', 'Interactive Exercises', '90-day Access'],
        badge: 'Popular',
        icon: Crown
    },
    {
        id: 'expert',
        name: 'Expert Package',
        description: 'Complete learning solution with 1-on-1 mentoring, certification, and lifetime access.',
        image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
        price: 199,
        features: ['All Premium Features', '1-on-1 Mentoring', 'Certification', 'Lifetime Access', 'Custom Projects'],
        badge: 'Best Value',
        icon: Zap
    }
];

export const ProductSelection = ({
                                     selectedProductId,
                                     layout = 'grid',
                                     showPricing = true,
                                     showFeatures = true,
                                     width = 800,
                                     height = 600,
                                     margin = [0, 0, 0, 0],
                                     borderRadius = 12
                                 }) => {
    const {
        connectors: { connect, drag },
        selected,
        actions: { setProp }
    } = useNode(state => ({
        selected: state.events.selected
    }));

    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState('');

    const handleProductSelect = (productId, e) => {
        e.stopPropagation();
        setProp(props => {
            props.selectedProductId = productId;
        });
    };

    const handleMouseDown = direction => e => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = width;
        const startHeight = height;

        const handleMouseMove = evt => {
            const deltaX = evt.clientX - startX;
            const deltaY = evt.clientY - startY;
            let newWidth = startWidth;
            let newHeight = startHeight;

            if (direction.includes('right')) {
                newWidth = Math.max(400, startWidth + deltaX);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(300, startHeight + deltaY);
            }

            setProp(props => {
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

    const getCursor = direction => {
        const cursors = {
            'bottom-right': 'se-resize',
            right: 'e-resize',
            bottom: 's-resize'
        };
        return cursors[direction] || 'default';
    };

    const getHandleStyle = direction => {
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

    return (
        <div
            ref={ref => connect(drag(ref))}
            className={`transition-all duration-200 relative ${selected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                width: `${width}px`,
                height: `${height}px`
            }}
            onClick={e => e.stopPropagation()}
        >
            <div
                className="w-full h-full bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
                style={{ borderRadius: `${borderRadius}px` }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Choose Your Package</h2>
                            <p className="text-sm text-gray-600">Select the perfect learning package for your needs</p>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
                    <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'space-y-4'}>
                        {SAMPLE_PRODUCTS.map(product => {
                            const Icon = product.icon;
                            const isSelected = selectedProductId === product.id;
                            return (
                                <div
                                    key={product.id}
                                    className={`relative bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                        isSelected
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-blue-50/50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={e => handleProductSelect(product.id, e)}
                                >
                                    {/* Badge */}
                                    {product.badge && (
                                        <div className="absolute -top-2 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {product.badge}
                                        </div>
                                    )}

                                    {/* Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div className="relative mb-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <div className="absolute top-2 left-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-gray-700" />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                                        </div>

                                        {/* Pricing */}
                                        {showPricing && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                                                    <span className="text-sm text-gray-500">one-time</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm text-gray-600">4.9</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Features */}
                                        {showFeatures && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-gray-700">What's included:</h4>
                                                <ul className="space-y-1">
                                                    {product.features.slice(0, 3).map((feat, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                                            <Check className="w-3 h-3 text-green-500" />
                                                            {feat}
                                                        </li>
                                                    ))}
                                                    {product.features.length > 3 && (
                                                        <li className="text-xs text-gray-500">
                                                            +{product.features.length - 3} more features
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Button */}
                                        <button
                                            className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                                                isSelected ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                            onClick={e => handleProductSelect(product.id, e)}
                                        >
                                            {isSelected ? 'Selected' : 'Select Package'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Resize Handles */}
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

ProductSelection.craft = {
    displayName: 'Product Selection',
    props: {
        selectedProductId: undefined,
        layout: 'grid',
        showPricing: true,
        showFeatures: true,
        width: 800,
        height: 600,
        margin: [0, 0, 0, 0],
        borderRadius: 12
    },
    related: {
        settings: ProductSelectionSettings
    }
};
