import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { AudioSettings } from './AudioSettings';
import { Upload, Music, X, Play, Pause, Volume2 } from 'lucide-react';

export const Audio = ({
                          src,
                          width = 350,
                          height = 80,
                          borderRadius = 8,
                          margin = [0, 0, 0, 0],
                          autoplay = false,
                          loop = false,
                          muted = false,
                          controls = true,
                          title = 'Audio Track',
                          backgroundColor = '#1f2937'
                      }) => {
    const {
        connectors: { connect, drag },
        selected,
        actions: { setProp }
    } = useNode((state) => ({
        selected: state.events.selected
    }));

    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const fileInputRef = useRef(null);
    const audioRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('audio/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target.result;
                setProp((props) => {
                    props.src = result;
                    props.title = file.name.replace(/\.[^/.]+$/, '');
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

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
                newWidth = Math.max(200, startWidth + deltaX);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(60, startHeight + deltaY);
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

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            className={`transition-all duration-200 relative ${selected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                width: `${width}px`,
                height: `${height}px`
            }}
            onClick={e => e.stopPropagation()}
        >
            <div
                className={`w-full h-full rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200 ${
                    isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : src
                            ? 'border-transparent'
                            : 'border-gray-300 bg-gray-50'
                }`}
                style={{
                    borderRadius: `${borderRadius}px`,
                    backgroundColor: src ? backgroundColor : undefined
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {src ? (
                    <div className="relative w-full h-full group">
                        <audio
                            ref={audioRef}
                            src={src}
                            autoPlay={autoplay}
                            loop={loop}
                            muted={muted}
                            controls={controls}
                            className="hidden"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                        <div className="w-full h-full flex items-center px-4 text-white">
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors mr-3"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </button>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate">{title}</span>
                                    <Volume2 className="w-4 h-4 ml-2" />
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                                    <div className="bg-white h-1 rounded-full w-1/3"></div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mr-2"
                            >
                                Change
                            </button>
                            <button
                                onClick={() => setProp((props) => { props.src = undefined })}
                                className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                            <Music className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Drop audio here</p>
                        <p className="text-xs text-gray-400">or click to browse</p>
                        <div className="mt-2 flex items-center gap-2">
                            <Upload className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">MP3, WAV, OGG</span>
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
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

Audio.craft = {
    displayName: 'Audio',
    props: {
        src: undefined,
        width: 350,
        height: 80,
        borderRadius: 8,
        margin: [0, 0, 0, 0],
        autoplay: false,
        loop: false,
        muted: false,
        controls: true,
        title: 'Audio Track',
        backgroundColor: '#1f2937'
    },
    related: {
        settings: AudioSettings
    }
};
