import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { DocumentSettings } from './DocumentSettings';
import { Upload, FileText, X, Download, Eye, FileSpreadsheet, Presentation, File } from 'lucide-react';

export const Document = ({
                             src,
                             fileName = 'Document',
                             fileType,
                             width = 600,
                             height = 400,
                             borderRadius = 8,
                             margin = [0, 0, 0, 0],
                             showToolbar = true,
                             allowDownload = true
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
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = file => {
        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = e => {
                const result = e.target.result;
                setProp(props => {
                    props.src = result;
                    props.fileName = file.name;
                    props.fileType = file.type;
                });
                setIsLoading(false);
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

    const getFileIcon = () => {
        if (!fileType) return FileText;
        if (fileType.includes('pdf')) return FileText;
        if (fileType.includes('sheet') || fileType.includes('excel')) return FileSpreadsheet;
        if (fileType.includes('presentation') || fileType.includes('powerpoint')) return Presentation;
        return File;
    };

    const getFileTypeLabel = () => {
        if (!fileType) return 'Document';
        if (fileType.includes('pdf')) return 'PDF';
        if (fileType.includes('sheet') || fileType.includes('excel')) return 'Excel';
        if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'PowerPoint';
        if (fileType.includes('word')) return 'Word';
        return 'Document';
    };

    const downloadFile = () => {
        if (src && fileName) {
            const link = document.createElement('a');
            link.href = src;
            link.download = fileName;
            link.click();
        }
    };

    const FileIcon = getFileIcon();

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
                className={`w-full h-full rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200 ${
                    isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : src
                            ? 'border-transparent bg-white shadow-lg'
                            : 'border-gray-300 bg-gray-50'
                }`}
                style={{ borderRadius: `${borderRadius}px` }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {src ? (
                    <div className="relative w-full h-full">
                        {showToolbar && (
                            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileIcon className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {fileName}
                  </span>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    {getFileTypeLabel()}
                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {allowDownload && (
                                        <button
                                            onClick={downloadFile}
                                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                                        title="Change file"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setProp(props => {
                                                props.src = undefined;
                                                props.fileName = undefined;
                                                props.fileType = undefined;
                                            })
                                        }
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                                        title="Remove"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="relative" style={{ height: showToolbar ? 'calc(100% - 44px)' : '100%' }}>
                            {fileType?.includes('pdf') ? (
                                <iframe src={src} className="w-full h-full" title={fileName} />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
                                        <FileIcon className="w-10 h-10 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{getFileTypeLabel()} Document</h3>
                                    <p className="text-sm text-gray-600 text-center max-w-xs mb-4">{fileName}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={downloadFile}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => window.open(src, '_blank')}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm font-medium">Loading document...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Document</h3>
                        <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed mb-4">
                            Drop your file here or click to browse
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">PDF</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Excel</span>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">PowerPoint</span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Word</span>
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
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

Document.craft = {
    displayName: 'Document',
    props: {
        src: undefined,
        fileName: undefined,
        fileType: undefined,
        width: 600,
        height: 400,
        borderRadius: 8,
        margin: [0, 0, 0, 0],
        showToolbar: true,
        allowDownload: true
    },
    related: {
        settings: DocumentSettings
    }
};
