import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { QuizBuilderSettings } from './QuizBuilderSettings';
import {
    HelpCircle,
    Plus,
    Trash2,
    Eye,
    Edit3,
    CheckCircle,
    Circle,
    Type,
    List,
    RotateCcw,
    Play,
    Settings
} from 'lucide-react';

const DEFAULT_QUESTIONS = [
    {
        id: '1',
        type: 'multiple-choice',
        question: 'What is the primary purpose of React hooks?',
        options: [
            { id: 'a', text: 'To replace class components', isCorrect: false },
            { id: 'b', text: 'To manage state and side effects in functional components', isCorrect: true },
            { id: 'c', text: 'To improve performance', isCorrect: false },
            { id: 'd', text: 'To handle routing', isCorrect: false }
        ],
        explanation: 'React hooks allow you to use state and other React features in functional components.',
        points: 10
    },
    {
        id: '2',
        type: 'true-false',
        question: 'TypeScript is a superset of JavaScript.',
        options: [
            { id: 'true', text: 'True', isCorrect: true },
            { id: 'false', text: 'False', isCorrect: false }
        ],
        explanation: 'TypeScript adds static type definitions to JavaScript.',
        points: 5
    }
];

export const QuizBuilder = ({
                                questions = DEFAULT_QUESTIONS,
                                title = 'Course Quiz',
                                description = 'Test your knowledge with this interactive quiz',
                                timeLimit = 30,
                                passingScore = 70,
                                showResults = true,
                                allowRetake = true,
                                width = 700,
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
    const [mode, setMode] = useState('builder');
    const [editingQuestion, setEditingQuestion] = useState(null);

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
                newWidth = Math.max(500, startWidth + deltaX);
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

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now().toString(),
            type: 'multiple-choice',
            question: 'New question',
            options: [
                { id: 'a', text: 'Option A', isCorrect: true },
                { id: 'b', text: 'Option B', isCorrect: false }
            ],
            points: 10
        };
        setProp(props => {
            props.questions = [...(props.questions || []), newQuestion];
        });
    };

    const deleteQuestion = (questionId, e) => {
        e.stopPropagation();
        setProp(props => {
            props.questions = (props.questions || []).filter(q => q.id !== questionId);
        });
    };

    const getQuestionTypeIcon = type => {
        switch (type) {
            case 'multiple-choice': return <Circle className="w-4 h-4" />;
            case 'true-false':      return <CheckCircle className="w-4 h-4" />;
            case 'short-answer':    return <Type className="w-4 h-4" />;
            case 'essay':           return <List className="w-4 h-4" />;
            default:                return <HelpCircle className="w-4 h-4" />;
        }
    };

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

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
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <HelpCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                                <p className="text-sm text-gray-600">{description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMode(mode === 'builder' ? 'preview' : 'builder')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    mode === 'preview'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {mode === 'preview'
                                    ? <Edit3 className="w-4 h-4" />
                                    : <Eye   className="w-4 h-4" />}
                                {mode === 'preview' ? 'Edit' : 'Preview'}
                            </button>
                        </div>
                    </div>
                    {/* Quiz Stats */}
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <HelpCircle className="w-4 h-4" />
                            {questions.length} questions
                        </div>
                        <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4" />
                            {totalPoints} points
                        </div>
                        <div className="flex items-center gap-1">
                            <RotateCcw className="w-4 h-4" />
                            {timeLimit} minutes
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {passingScore}% to pass
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
                    {mode === 'builder' ? (
                        <div className="space-y-4">
                            <button
                                onClick={addQuestion}
                                className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg text-gray-600 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add New Question
                            </button>
                            {questions.map((question, index) => (
                                <div key={question.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
                                                {getQuestionTypeIcon(question.type)}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                                                <p className="text-xs text-gray-500 capitalize">{question.type.replace('-', ' ')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{question.points} pts</span>
                                            <button onClick={() => setEditingQuestion(editingQuestion === question.id ? null : question.id)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={e => deleteQuestion(question.id, e)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h5 className="font-medium text-gray-800 mb-2">{question.question}</h5>
                                        </div>
                                        <div className="space-y-2">
                                            {question.options.map(option => (
                                                <div key={option.id} className={`flex items-center gap-3 p-2 rounded ${option.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'}`}>
                                                    <div className={`w-4 h-4 rounded-full border-2 ${option.isCorrect ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                                        {option.isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{option.text}</span>
                                                    {option.isCorrect && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-auto">Correct</span>}
                                                </div>
                                            ))}
                                        </div>
                                        {question.explanation && (
                                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                                <h6 className="text-xs font-medium text-blue-700 mb-1">Explanation</h6>
                                                <p className="text-sm text-blue-600">{question.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Play className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Start?</h3>
                                <p className="text-gray-600 mb-4">
                                    This quiz contains {questions.length} questions worth {totalPoints} points total.
                                </p>
                                <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                                    Start Quiz
                                </button>
                            </div>
                            <div className="space-y-4">
                                {questions.slice(0, 2).map((question, index) => (
                                    <div key={question.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-800 mb-3">
                                            {index + 1}. {question.question}
                                        </h4>
                                        <div className="space-y-2">
                                            {question.options.map(option => (
                                                <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                                                        name={`question-${question.id}`}
                                                        className="w-4 h-4 text-purple-500"
                                                        disabled
                                                    />
                                                    <span className="text-sm text-gray-700">{option.text}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {questions.length > 2 && (
                                    <div className="text-center text-gray-500 text-sm">
                                        ... and {questions.length - 2} more questions
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Resize Handles */}
            {selected && (
                <>
                    <div style={{ ...getHandleStyle('bottom-right'), bottom: 0, right: 0 }} onMouseDown={handleMouseDown('bottom-right')} />
                    <div style={{ ...getHandleStyle('right'), right: 0, top: '50%' }} onMouseDown={handleMouseDown('right')} />
                    <div style={{ ...getHandleStyle('bottom'), bottom: 0, left: '50%' }} onMouseDown={handleMouseDown('bottom')} />
                </>
            )}
        </div>
    );
};

QuizBuilder.craft = {
    displayName: 'Quiz Builder',
    props: {
        questions: DEFAULT_QUESTIONS,
        title: 'Course Quiz',
        description: 'Test your knowledge with this interactive quiz',
        timeLimit: 30,
        passingScore: 70,
        showResults: true,
        allowRetake: true,
        width: 700,
        height: 600,
        margin: [0, 0, 0, 0],
        borderRadius: 12
    },
    related: {
        settings: QuizBuilderSettings
    }
};
