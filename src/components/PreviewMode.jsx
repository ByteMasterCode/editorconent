import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { usePagesContext } from '../contexts/PagesContext';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Play,
    Pause,
    RotateCcw,
    Maximize,
    Monitor,
    Tablet,
    Smartphone
} from 'lucide-react';

export const PreviewMode = ({ isOpen, onClose }) => {
    const { query } = useEditor();
    const {
        pages,
        currentPageId,
        currentPageIndex,
        nextPage,
        prevPage,
        canGoNext,
        canGoPrev,
        setCurrentPage
    } = usePagesContext();

    const [viewMode, setViewMode] = useState('desktop');
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    if (!isOpen) return null;

    const currentPage = pages.find((page) => page.id === currentPageId);

    const getViewportStyles = () => {
        switch (viewMode) {
            case 'tablet':
                return { width: '768px', height: '1024px' };
            case 'mobile':
                return { width: '375px', height: '667px' };
            default:
                return { width: '100%', height: '100%' };
        }
    };

    const ViewportButton = ({ mode, icon: Icon, label }) => (
        <button
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === mode
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Preview Mode</h1>
                                <p className="text-sm text-gray-400">Course Preview</p>
                            </div>
                        </div>
                    </div>

                    {/* Center */}
                    <div className="flex items-center gap-2">
                        <ViewportButton mode="desktop" icon={Monitor} label="Desktop" />
                        <ViewportButton mode="tablet" icon={Tablet} label="Tablet" />
                        <ViewportButton mode="mobile" icon={Smartphone} label="Mobile" />
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAutoPlay(!isAutoPlay)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                isAutoPlay
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            Auto Play
                        </button>

                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                            <RotateCcw className="w-5 h-5" />
                        </button>

                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                <div
                    className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
                    style={getViewportStyles()}
                >
                    <div className="w-full h-full overflow-auto">
                        {currentPage && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: query.serialize()
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50 px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Nav */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevPage}
                            disabled={!canGoPrev}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                canGoPrev
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Prev
                        </button>

                        <div className="flex items-center gap-2">
                            {pages.map((page) => (
                                <button
                                    key={page.id}
                                    onClick={() => setCurrentPage(page.id)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        currentPageId === page.id
                                            ? 'bg-blue-500 scale-125'
                                            : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                                    title={page.title}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={!canGoNext}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                canGoNext
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Page Info */}
                    <div className="text-center">
                        <div className="text-white font-semibold">{currentPage?.title}</div>
                        <div className="text-sm text-gray-400">
                            {currentPageIndex + 1} / {pages.length}
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Progress</span>
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                                style={{ width: `${((currentPageIndex + 1) / pages.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-400 font-mono">
              {Math.round(((currentPageIndex + 1) / pages.length) * 100)}%
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
