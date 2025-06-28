import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { IframeSettings } from './IframeSettings';
import { Globe, ExternalLink, RefreshCw, Lock, Unlock } from 'lucide-react';

export const Iframe = ({
                           src,
                           title = 'Embedded Content',
                           width = 600,
                           height = 400,
                           borderRadius = 8,
                           margin = [0, 0, 0, 0],
                           allowFullscreen = true,
                           sandbox = 'allow-scripts allow-same-origin allow-forms',
                           loading = 'lazy'
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
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef(null);

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
                newWidth = Math.max(300, startWidth + deltaX);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(200, startHeight + deltaY);
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

    const refreshIframe = () => {
        if (iframeRef.current && src) {
            setIsLoading(true);
            iframeRef.current.src = src;
        }
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
        >
            <div
                className="w-full h-full rounded-lg overflow-hidden border border-gray-300 bg-white relative"
                style={{ borderRadius: `${borderRadius}px` }}
            >
                {src ? (
                    <>
                        {/* Iframe Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                  {title}
                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={refreshIframe}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    onClick={() => window.open(src, '_blank')}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                                {sandbox ? (
                                    <Lock className="w-3 h-3 text-green-500" title="Sandboxed" />
                                ) : (
                                    <Unlock className="w-3 h-3 text-orange-500" title="Not sandboxed" />
                                )}
                            </div>
                        </div>

                        {/* Iframe Content */}
                        <div className="relative" style={{ height: 'calc(100% - 40px)' }}>
                            <iframe
                                ref={iframeRef}
                                src={src}
                                title={title}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen={allowFullscreen}
                                sandbox={sandbox}
                                loading={loading}
                                onLoad={() => setIsLoading(false)}
                                className="w-full h-full"
                            />
                            {isLoading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Loading...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <Globe className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Embed Content</h3>
                        <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
                            Add a URL in the properties panel to embed websites, PDFs, or other content
                        </p>
                        <div className="mt-4 text-xs text-gray-400">
                            Supports: Websites, PDFs, Google Docs, YouTube, etc.
                        </div>
                    </div>
                )}
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

Iframe.craft = {
    displayName: 'Iframe',
    props: {
        src: undefined,
        title: 'Embedded Content',
        width: 600,
        height: 400,
        borderRadius: 8,
        margin: [0, 0, 0, 0],
        allowFullscreen: true,
        sandbox: 'allow-scripts allow-same-origin allow-forms',
        loading: 'lazy'
    },
    related: {
        settings: IframeSettings
    }
};
