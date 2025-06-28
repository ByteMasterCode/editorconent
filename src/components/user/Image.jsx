import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { ImageSettings } from './ImageSettings';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export const Image = ({
                          src,
                          alt = 'Image',
                          width = 300,
                          height = 200,
                          borderRadius = 8,
                          margin = [0, 0, 0, 0],
                          objectFit = 'cover',
                          opacity = 1
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
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = file => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = e => {
                const result = e.target.result;
                setProp(props => {
                    props.src = result;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInput = e => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
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
                newWidth = Math.max(50, startWidth + deltaX);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(50, startHeight + deltaY);
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

    const getCursor = direction => {
        const cursors = {
            'bottom-right': 'se-resize',
            right: 'e-resize',
            bottom: 's-resize'
        };
        return cursors[direction] || 'default';
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
            onMouseDown={e => {
                if (!isResizing) e.stopPropagation();
            }}
        >
            <div
                className={`w-full h-full rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200 ${
                    isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : src
                            ? 'border-transparent'
                            : 'border-gray-300 bg-gray-50'
                }`}
                style={{ borderRadius: `${borderRadius}px` }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {src ? (
                    <div className="relative w-full h-full group">
                        <img
                            src={src}
                            alt={alt}
                            className="w-full h-full transition-opacity duration-200"
                            style={{ objectFit, opacity }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    fileInputRef.current.click();
                                }}
                                className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mr-2"
                            >
                                Change
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setProp(props => {
                                        props.src = undefined;
                                    });
                                }}
                                className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={e => {
                            e.stopPropagation();
                            fileInputRef.current.click();
                        }}
                    >
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Drop image here</p>
                        <p className="text-xs text-gray-400">or click to browse</p>
                        <div className="mt-3 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">JPG, PNG, GIF up to 10MB</span>
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
            />

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

Image.craft = {
    displayName: 'Image',
    props: {
        src: undefined,
        alt: 'Image',
        width: 300,
        height: 200,
        borderRadius: 8,
        margin: [0, 0, 0, 0],
        objectFit: 'cover',
        opacity: 1
    },
    related: {
        settings: ImageSettings
    }
};
