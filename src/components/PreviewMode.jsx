import React, { useState, useEffect } from 'react';
import { Frame } from '@craftjs/core';
import { usePagesContext } from '../contexts/PagesContext';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Play,
    Pause,
    RotateCcw,
    Monitor,
    Tablet,
    Smartphone,
    CheckCircle,
    BookOpen,
    Clock,
    Star
} from 'lucide-react';

export const PreviewMode = ({ isOpen, onClose }) => {
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
    useEffect(() => {
        console.log('📦 Pages data for backend:', JSON.stringify(pages, null, 2));
    }, [pages]);
    useEffect(() => {
        let interval;
        if (isAutoPlay) {
            interval = setInterval(() => {
                if (canGoNext) {
                    nextPage();
                } else {
                    setIsAutoPlay(false);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlay, canGoNext, nextPage]);

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

    const getTypeIcon = (type) => {
        switch (type) {
            case 'quiz':
                return <CheckCircle className="w-4 h-4" />;
            case 'assignment':
                return <Star className="w-4 h-4" />;
            default:
                return <BookOpen className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'quiz':
                return 'text-green-600';
            case 'assignment':
                return 'text-yellow-600';
            default:
                return 'text-blue-600';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Close Preview"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-white">Course Preview</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${
                            isAutoPlay
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                        }`}
                        aria-label={isAutoPlay ? 'Pause Autoplay' : 'Start Autoplay'}
                    >
                        {isAutoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        Auto
                    </button>

                    <button
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors duration-200"
                        onClick={() => setCurrentPage(pages[0]?.id)}
                        aria-label="Reset Course"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-900 p-6 overflow-y-auto border-r border-gray-100 shadow-2xl">
                    {/* 📘 Course Info Block */}
                    <div className="mb-8 p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-1 mb-3">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Web Development
              </span>
                            <h2 className="text-xl font-bold text-gray-900 leading-snug">
                                Basics of Angular
                            </h2>
                            <p className="text-sm text-gray-600">
                                Introductory course for Angular and framework basics.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                30 minutes
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Completed twice
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-500" />
                                Category: <span className="text-gray-800 font-medium">Frontend</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src="/images/avatar-teacher.png" alt="Teacher" className="w-5 h-5 rounded-full" />
                                by <span className="text-gray-800 font-medium">John Doe</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Timeline</h2>

                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                        <div className="space-y-6">
                            {pages.map((page, index) => {
                                const isActive = currentPageId === page.id;
                                const isCompleted = index < currentPageIndex;

                                return (
                                    <div key={page.id} className="relative flex items-start group">
                                        <div
                                            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-blue-500 border-blue-500 shadow-lg scale-110 animate-pulse'
                                                    : isCompleted
                                                        ? 'bg-green-500 border-green-500 shadow-md'
                                                        : 'bg-white border-gray-300 group-hover:border-blue-400 group-hover:shadow-md'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            ) : (
                                                <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                          {index + 1}
                        </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(page.id)}
                                            className={`ml-4 flex-1 text-left p-4 rounded-xl transition-all duration-300 transform group-hover:translate-x-1 ${
                                                isActive
                                                    ? 'bg-blue-50 border-2 border-blue-200 shadow-lg'
                                                    : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-300 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={getTypeColor(page.type)}>
                                                    {getTypeIcon(page.type)}
                                                </div>
                                                <span className={`text-xs font-medium uppercase tracking-wide ${
                                                    isActive ? 'text-blue-700' : 'text-gray-500'
                                                }`}>
                          {page.type || 'lesson'}
                        </span>
                                            </div>
                                            <h3 className={`font-semibold mb-1 ${
                                                isActive ? 'text-blue-800' : 'text-gray-800 group-hover:text-blue-700'
                                            }`}>
                                                {page.title || `Untitled Lesson`}
                                            </h3>
                                            {page.duration && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{page.duration}</span>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 flex items-center justify-center p-6 bg-gray-100 overflow-auto">
                    <div
                        className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border border-gray-200"
                        style={getViewportStyles()}
                    >
                        <div className="w-full h-full overflow-auto p-4">
                            {currentPage?.content ? (
                                <Frame data={currentPage.content} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>Select a lesson from the sidebar to view its content.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between text-white shadow-lg">
                <div className="flex gap-3">
                    <button
                        onClick={prevPage}
                        disabled={!canGoPrev}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${
                            canGoPrev
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                                : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        }`}
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="inline w-4 h-4 mr-2" />
                        Prev
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={!canGoNext}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${
                            canGoNext
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                                : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        }`}
                        aria-label="Next Page"
                    >
                        Next
                        <ChevronRight className="inline w-4 h-4 ml-2" />
                    </button>
                </div>

                <div className="text-center text-sm text-gray-300">
                    {currentPageIndex + 1} / {pages.length}
                </div>

                <div className="flex gap-2">
                    {[{ icon: Monitor, mode: 'desktop' }, { icon: Tablet, mode: 'tablet' }, { icon: Smartphone, mode: 'mobile' }].map(
                        (item, i) => (
                            <button
                                key={i}
                                onClick={() => setViewMode(item.mode)}
                                className={`p-2 rounded-full transition-colors duration-200 ${
                                    viewMode === item.mode
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                                aria-label={item.mode + ' View'}
                            >
                                <item.icon className="w-4 h-4" />
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
