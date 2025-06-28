import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { ButtonSettings } from './ButtonSettings';

export const Button = ({
                           text = 'Click me',
                           backgroundColor = '#3B82F6',
                           color = '#ffffff',
                           padding = [12, 24, 12, 24],
                           borderRadius = 8,
                           margin = [0, 0, 0, 0],
                           size = 'md',
                           width = 120,
                           height = 40
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
    const [isEditing, setIsEditing] = useState(false);
    const buttonRef = useRef(null);

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const handleDoubleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);

        setTimeout(() => {
            if (buttonRef.current) {
                buttonRef.current.focus();
                const range = document.createRange();
                range.selectNodeContents(buttonRef.current);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }, 10);
    };

    const handleTextBlur = (e) => {
        setProp((props) => (props.text = e.target.innerText));
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
            setIsEditing(false);
        }
        if (isEditing && e.key !== 'Escape') {
            return;
        }
        e.stopPropagation();
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
                newWidth = Math.max(50, startWidth + deltaX);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(30, startHeight + deltaY);
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
            width: '7px',
            height: '7px',
            background: isActive ? '#3b82f6' : '#2563eb',
            border: '2px solid white',
            borderRadius: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            cursor: getCursor(direction),
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            transition: isActive ? 'none' : 'all 0.15s ease',
            zIndex: 10
        };
    };

    const getCursor = (direction) => {
        const cursors = {
            'bottom-right': 'se-resize',
            right: 'e-resize',
            bottom: 's-resize'
        };
        return cursors[direction] || 'default';
    };

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            className={`inline-block transition-all duration-200 relative ${selected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                width: `${width}px`,
                height: `${height}px`
            }}
            onClick={e => e.stopPropagation()}
        >
            <button
                ref={buttonRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={handleTextBlur}
                onDoubleClick={handleDoubleClick}
                onKeyDown={handleKeyDown}
                style={{
                    backgroundColor,
                    color,
                    borderRadius: `${borderRadius}px`,
                    outline: 'none',
                    border: 'none',
                    cursor: isEditing ? 'text' : 'pointer',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: isEditing ? 'text' : 'none',
                    pointerEvents: 'auto'
                }}
                className={`${sizeClasses[size]} font-medium transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
                {text}
            </button>

            {selected && !isEditing && (
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

Button.craft = {
    displayName: 'Button',
    props: {
        text: 'Click me',
        backgroundColor: '#3B82F6',
        color: '#ffffff',
        padding: [12, 24, 12, 24],
        borderRadius: 8,
        margin: [0, 0, 0, 0],
        size: 'md',
        width: 120,
        height: 40
    },
    related: {
        settings: ButtonSettings
    }
};
