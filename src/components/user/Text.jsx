import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { TextSettings } from './TextSettings';

export const Text = ({
                         text = 'Click to edit text',
                         fontSize = 16,
                         textAlign = 'left',
                         color = '#333333',
                         fontWeight = 'normal',
                         margin = [0, 0, 0, 0],
                         width = 200,
                         height = 50
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
    const [isEditing, setIsEditing] = useState(false);
    const textRef = useRef(null);

    const handleDoubleClick = e => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
        setTimeout(() => {
            if (textRef.current) {
                textRef.current.focus();
                const range = document.createRange();
                range.selectNodeContents(textRef.current);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }, 10);
    };

    const handleTextBlur = e => {
        setProp(props => {
            props.text = e.target.innerText;
        });
        setIsEditing(false);
    };

    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
            setIsEditing(false);
        } else if (!isEditing) {
            e.stopPropagation();
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
            if (direction.includes('right')) newW = Math.max(50, startW + dx);
            if (direction.includes('bottom')) newH = Math.max(20, startH + dy);
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
            width: '7px',
            height: '7px',
            background: active ? '#3b82f6' : '#2563eb',
            border: '2px solid white',
            borderRadius: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            cursor: getCursor(dir),
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
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
            <p
                ref={textRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={handleTextBlur}
                onDoubleClick={handleDoubleClick}
                onKeyDown={handleKeyDown}
                style={{
                    fontSize: `${fontSize}px`,
                    textAlign,
                    color,
                    fontWeight,
                    outline: 'none',
                    cursor: isEditing ? 'text' : 'pointer',
                    width: '100%',
                    height: '100%',
                    minHeight: '1.2em',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    userSelect: isEditing ? 'text' : 'none'
                }}
            >
                {text}
            </p>

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

Text.craft = {
    displayName: 'Text',
    props: {
        text: 'Click to edit text',
        fontSize: 16,
        textAlign: 'left',
        color: '#333333',
        fontWeight: 'normal',
        margin: [0, 0, 0, 0],
        width: 200,
        height: 50
    },
    related: {
        settings: TextSettings
    }
};
