import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { CourseTimelineSettings } from './CourseTimelineSettings';
import { Clock, CheckCircle, Circle, Play, Lock, Star, BookOpen } from 'lucide-react';

const DEFAULT_SECTIONS = [
    {
        id: '1',
        title: 'Course Introduction',
        description: "Welcome to the course! Learn about the structure and what you'll achieve.",
        duration: '15 min',
        status: 'completed',
        lessons: 3,
        progress: 100
    },
    {
        id: '2',
        title: 'Fundamentals',
        description: 'Master the core concepts and build a solid foundation for advanced topics.',
        duration: '2 hours',
        status: 'completed',
        lessons: 8,
        progress: 100
    },
    {
        id: '3',
        title: 'Practical Applications',
        description: 'Apply your knowledge through hands-on exercises and real-world projects.',
        duration: '3 hours',
        status: 'current',
        lessons: 12,
        progress: 65
    },
    {
        id: '4',
        title: 'Advanced Techniques',
        description: 'Dive deep into advanced concepts and professional best practices.',
        duration: '4 hours',
        status: 'available',
        lessons: 15,
        progress: 0
    },
    {
        id: '5',
        title: 'Final Project',
        description: 'Showcase your skills by building a comprehensive capstone project.',
        duration: '6 hours',
        status: 'locked',
        lessons: 10,
        progress: 0
    },
    {
        id: '6',
        title: 'Certification',
        description: 'Complete the final assessment and receive your course certificate.',
        duration: '1 hour',
        status: 'locked',
        lessons: 2,
        progress: 0
    }
];

export const CourseTimeline = ({
                                   sections = DEFAULT_SECTIONS,
                                   showProgress = true,
                                   showDuration = true,
                                   showLessons = true,
                                   width = 600,
                                   height = 700,
                                   margin = [0, 0, 0, 0],
                                   borderRadius = 12,
                                   accentColor = '#3b82f6'
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
                newHeight = Math.max(400, startHeight + deltaY);
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

    const getStatusIcon = status => {
        if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (status === 'current')   return <Play        className="w-5 h-5 text-blue-500" />;
        if (status === 'locked')    return <Lock        className="w-5 h-5 text-gray-400" />;
        return <Circle className="w-5 h-5 text-gray-300" />;
    };

    const getStatusColor = status => {
        if (status === 'completed') return 'border-green-500 bg-green-50';
        if (status === 'current')   return 'border-blue-500 bg-blue-50';
        if (status === 'locked')    return 'border-gray-300 bg-gray-50';
        return 'border-gray-300 bg-white hover:bg-gray-50';
    };

    const totalProgress =
        sections.reduce((acc, sec) => acc + (sec.progress || 0), 0) / sections.length;

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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Course Progress</h2>
                                <p className="text-sm text-gray-600">Track your learning journey</p>
                            </div>
                        </div>
                        {showProgress && (
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800">
                                    {Math.round(totalProgress)}%
                                </div>
                                <div className="text-xs text-gray-500">Complete</div>
                            </div>
                        )}
                    </div>
                    {showProgress && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${totalProgress}%`, backgroundColor: accentColor }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                        <div className="space-y-6">
                            {sections.map((section, idx) => (
                                <div key={section.id} className="relative flex items-start gap-4">
                                    <div className="relative z-10 flex-shrink-0">
                                        <div
                                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(
                                                section.status
                                            )}`}
                                        >
                                            {getStatusIcon(section.status)}
                                        </div>
                                        {idx < sections.length - 1 && section.status === 'completed' && (
                                            <div
                                                className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6"
                                                style={{ backgroundColor: accentColor }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className={`bg-white border rounded-lg p-4 transition-all duration-200 ${getStatusColor(
                                                section.status
                                            )} ${
                                                section.status === 'current' ? 'shadow-md' : 'hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3
                                                    className={`font-semibold ${
                                                        section.status === 'locked' ? 'text-gray-400' : 'text-gray-800'
                                                    }`}
                                                >
                                                    {section.title}
                                                </h3>
                                                {section.status === 'current' && (
                                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                                                )}
                                            </div>
                                            <p
                                                className={`text-sm mb-3 ${
                                                    section.status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                                                }`}
                                            >
                                                {section.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                {showDuration && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {section.duration}
                                                    </div>
                                                )}
                                                {showLessons && (
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="w-3 h-3" />
                                                        {section.lessons} lessons
                                                    </div>
                                                )}
                                                {section.status === 'completed' && (
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <Star className="w-3 h-3" />
                                                        Completed
                                                    </div>
                                                )}
                                            </div>
                                            {showProgress && section.status !== 'locked' && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                        <span>Progress</span>
                                                        <span>{section.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="h-1.5 rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${section.progress}%`,
                                                                backgroundColor:
                                                                    section.status === 'completed' ? '#10b981' : accentColor
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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

CourseTimeline.craft = {
    displayName: 'Course Timeline',
    props: {
        sections: DEFAULT_SECTIONS,
        showProgress: true,
        showDuration: true,
        showLessons: true,
        width: 600,
        height: 700,
        margin: [0, 0, 0, 0],
        borderRadius: 12,
        accentColor: '#3b82f6'
    },
    related: {
        settings: CourseTimelineSettings
    }
};
