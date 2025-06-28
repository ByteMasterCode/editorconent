import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeBlockSettings } from './CodeBlockSettings';

export const CodeBlock = ({
                              code = 'console.log("Hello, World!");',
                              language = 'javascript',
                              showLineNumbers = true,
                              margin = [16, 0, 16, 0],
                              width = 400,
                              height = 200
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
                newHeight = Math.max(100, startHeight + deltaY);
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
            <div className="relative w-full h-full overflow-hidden rounded-lg">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    showLineNumbers={showLineNumbers}
                    customStyle={{
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        overflow: 'auto'
                    }}
                >
                    {code}
                </SyntaxHighlighter>
                <div className="absolute top-2 right-2">
          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono">
            {language}
          </span>
                </div>
            </div>

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

CodeBlock.craft = {
    displayName: 'Code Block',
    props: {
        code: 'console.log("Hello, World!");',
        language: 'javascript',
        showLineNumbers: true,
        margin: [16, 0, 16, 0],
        width: 400,
        height: 200
    },
    related: {
        settings: CodeBlockSettings
    }
};
