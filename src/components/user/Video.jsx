import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { VideoSettings } from './VideoSettings';
import { Upload, Video as VideoIcon, X, Play, Pause } from 'lucide-react';

export const Video = ({
                          src,
                          width = 400,
                          height = 225,
                          borderRadius = 8,
                          margin = [0, 0, 0, 0],
                          autoplay = false,
                          loop = false,
                          muted = true,
                          controls = true,
                          poster
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
    const [isPlaying, setIsPlaying] = useState(false);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    const handleFileSelect = file => {
        if (file && file.type.startsWith('video/')) {
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

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMouseDown = direction => e => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);

        const startX = e.clientX;
        const startY = e.clientY;
        const startW = width;
        const startH = height;

        const onMouseMove = evt => {
            const dx = evt.clientX - startX;
            const dy = evt.clientY - startY;
            let newW = startW;
            let newH = startH;
            if (direction.includes('right')) newW = Math.max(200, startW + dx);
            if (direction.includes('bottom')) newH = Math.max(100, startH + dy);
            setProp(props => {
                props.width = newW;
                props.height = newH;
            });
        };

        const onMouseUp = () => {
            setIsResizing(false);
            setResizeDirection('');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const getCursor = dir => {
        const cursors = { 'bottom-right': 'se-resize', right: 'e-resize', bottom: 's-resize' };
        return cursors[dir] || 'default';
    };

    const getHandleStyle = dir => {
        const active = isResizing && resizeDirection === dir;
        return {
            width: '8px',
            height: '8px',
            background: active ? '#3b82f6' : '#2563eb',
            border: '2px solid white',
            borderRadius: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            cursor: getCursor(dir),
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: active ? 'none' : 'all 0.15s ease',
            zIndex: 10
        };
    };

    return (
        <div
            ref={ref => connect(drag(ref))}
            className={`relative transition-all duration-200 ${selected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                width: `${width}px`,
                height: `${height}px`
            }}
        >
            <div
                className={`w-full h-full rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200 ${
                    isDragOver ? 'border-blue-500 bg-blue-50' : src ? 'border-transparent' : 'border-gray-300 bg-gray-50'
                }`}
                style={{ borderRadius: `${borderRadius}px` }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {src ? (
                    <div className="relative w-full h-full group">
                        <video
                            ref={videoRef}
                            src={src}
                            poster={poster}
                            autoPlay={autoplay}
                            loop={loop}
                            muted={muted}
                            controls={controls}
                            className="w-full h-full object-cover"
                            style={{ borderRadius: `${borderRadius}px` }}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mr-2"
                            >
                                Change
                            </button>
                            <button
                                onClick={() => setProp(props => { props.src = undefined; })}
                                className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                            <VideoIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Drop video here</p>
                        <p className="text-xs text-gray-400">or click to browse</p>
                        <div className="mt-3 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">MP4, WebM, OGV up to 50MB</span>
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
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

Video.craft = {
    displayName: 'Video',
    props: {
        src: undefined,
        width: 400,
        height: 225,
        borderRadius: 8,
        margin: [0, 0, 0, 0],
        autoplay: false,
        loop: false,
        muted: true,
        controls: true,
        poster: undefined
    },
    related: {
        settings: VideoSettings
    }
};
