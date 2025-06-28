// Text.jsx
import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { TextSettings } from './TextSettings';

export const Text = ({
                         text = 'Click to edit text',
                         fontFamily = 'Arial',
                         fontSize = 16,
                         textAlign = 'left',
                         color = '#333333',
                         fontWeight = 'normal',
                         fontStyle = 'normal',
                         textDecoration = 'none',
                         backgroundColor = 'transparent',
                         lineHeight = 1.2,
                         letterSpacing = 0,
                         paragraphSpacing = 0,
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

    // Двойной клик — начало редактирования
    const handleDoubleClick = e => {
        e.preventDefault(); e.stopPropagation();
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
        setProp(p => { p.text = e.target.innerText; });
        setIsEditing(false);
    };
    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault(); e.stopPropagation();
            e.currentTarget.blur();
            setIsEditing(false);
        } else if (!isEditing) {
            e.stopPropagation();
        }
    };

    // Ресайз
    const handleMouseDown = dir => e => {
        e.preventDefault(); e.stopPropagation();
        setIsResizing(true); setResizeDirection(dir);
        const startX = e.clientX, startY = e.clientY;
        const startW = width, startH = height;

        const onMouseMove = evt => {
            const dx = evt.clientX - startX, dy = evt.clientY - startY;
            let newW = startW, newH = startH;
            if (dir.includes('right')) newW = Math.max(50, startW + dx);
            if (dir.includes('bottom')) newH = Math.max(20, startH + dy);
            setProp(p => { p.width = newW; p.height = newH; });
        };
        const onMouseUp = () => {
            setIsResizing(false); setResizeDirection('');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    const getCursor = dir => ({
        'bottom-right': 'se-resize', right: 'e-resize', bottom: 's-resize'
    }[dir] || 'default');
    const getHandleStyle = dir => {
        const active = isResizing && resizeDirection === dir;
        return {
            width: '7px', height: '7px',
            background: active ? '#3b82f6' : '#2563eb',
            border: '2px solid white', borderRadius: '50%',
            position: 'absolute', transform: 'translate(-50%, -50%)',
            cursor: getCursor(dir), boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            transition: active ? 'none' : 'all 0.15s ease', zIndex: 10
        };
    };

    // Маппинг для justify-content
    const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };

    // Стили для <p>
    const pStyle = {
        fontFamily,
        fontSize: `${fontSize}px`,
        color,
        fontWeight,
        fontStyle,
        textDecoration,
        lineHeight,
        letterSpacing: `${letterSpacing}px`,
        margin: 0,
        marginBottom: `${paragraphSpacing}px`,
        outline: 'none',
        cursor: isEditing ? 'text' : 'pointer',
        width: '100%',
        height: '100%',
        minHeight: '1.2em',
        padding: '4px',
        userSelect: isEditing ? 'text' : 'none',
        display: textAlign === 'justify' ? 'block' : 'flex',
        ...(textAlign === 'justify'
            ? { textAlign: 'justify' }
            : { justifyContent: justifyMap[textAlign] || 'flex-start',
                alignItems: 'center' })
    };

    return (
        <div
            ref={ref => connect(drag(ref))}
            className={`relative transition-all duration-200 ${selected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor
            }}
            onClick={e => e.stopPropagation()}
        >
            <p
                ref={textRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={handleTextBlur}
                onDoubleClick={handleDoubleClick}
                onKeyDown={handleKeyDown}
                style={pStyle}
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
        fontFamily: 'Arial',
        fontSize: 16,
        textAlign: 'left',
        color: '#333333',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        lineHeight: 1.2,
        letterSpacing: 0,
        paragraphSpacing: 0,
        margin: [0, 0, 0, 0],
        width: 200,
        height: 50
    },
    related: {
        settings: TextSettings
    }
};
