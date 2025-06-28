import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { ContainerSettings } from './ContainerSettings';

export const Container = ({
                              background = '#ffffff',
                              backgroundImage,
                              padding = [20, 20, 20, 20],
                              margin = [0, 0, 0, 0],
                              borderRadius = 8,
                              minHeight = 100,
                              width = 300,
                              height = 200,
                              x = 0,
                              y = 0,
                              rotation = 0,
                              opacity = 1,
                              visible = true,
                              boxShadow,
                              flexDirection = 'column',
                              alignItems = 'flex-start',
                              justifyContent = 'flex-start',
                              gap = 0,
                              display = 'flex',
                              textAlign = 'left',
                              children
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

    const containerStyle = {
        background: backgroundImage || background,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        borderRadius: `${borderRadius}px`,
        minHeight: `auto`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        opacity,
        display: visible ? display : 'none',
        flexDirection: display === 'flex' ? flexDirection : undefined,
        alignItems: display === 'flex' ? alignItems : undefined,
        justifyContent: display === 'flex' ? justifyContent : undefined,
        gap: display === 'flex' ? `${gap}px` : undefined,
        textAlign,
        boxShadow,
        transition: isResizing ? 'none' : 'all 0.2s ease-in-out',
        position: 'relative'
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
            if (direction.includes('left')) {
                newWidth = Math.max(50, startWidth - deltaX);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(50, startHeight + deltaY);
            }
            if (direction.includes('top')) {
                newHeight = Math.max(50, startHeight - deltaY);
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
            'top-left': 'nw-resize',
            'top-right': 'ne-resize',
            'bottom-left': 'sw-resize',
            'bottom-right': 'se-resize',
            'top': 'n-resize',
            'bottom': 's-resize',
            'left': 'w-resize',
            'right': 'e-resize'
        };
        return cursors[direction] || 'default';
    };

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            className={`transition-all duration-200 ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            style={containerStyle}
            onClick={e => e.stopPropagation()}
        >
            {children}

            {selected && (
                <>
                    {/* Corners */}
                    <div
                        style={{ ...getHandleStyle('top-left'), top: 0, left: 0 }}
                        onMouseDown={handleMouseDown('top-left')}
                        data-resize-handle
                    />
                    <div
                        style={{ ...getHandleStyle('top-right'), top: 0, right: 0 }}
                        onMouseDown={handleMouseDown('top-right')}
                        data-resize-handle
                    />
                    <div
                        style={{ ...getHandleStyle('bottom-left'), bottom: 0, left: 0 }}
                        onMouseDown={handleMouseDown('bottom-left')}
                        data-resize-handle
                    />
                    <div
                        style={{ ...getHandleStyle('bottom-right'), bottom: 0, right: 0 }}
                        onMouseDown={handleMouseDown('bottom-right')}
                        data-resize-handle
                    />

                    {/* Edges */}
                    <div
                        style={{ ...getHandleStyle('top'), top: 0, left: '50%' }}
                        onMouseDown={handleMouseDown('top')}
                        data-resize-handle
                    />
                    <div
                        style={{ ...getHandleStyle('bottom'), bottom: 0, left: '50%' }}
                        onMouseDown={handleMouseDown('bottom')}
                        data-resize-handle
                    />
                    <div
                        style={{ ...getHandleStyle('left'), left: 0, top: '50%' }}
                        onMouseDown={handleMouseDown('left')}
                        data-resize-handle
                    />
                    <div
                        style={{ ...getHandleStyle('right'), right: 0, top: '50%' }}
                        onMouseDown={handleMouseDown('right')}
                        data-resize-handle
                    />
                </>
            )}
        </div>
    );
};

Container.craft = {
    displayName: 'Container',
    props: {
        background: '#ffffff',
        backgroundImage: null,
        padding: [20, 20, 20, 20],
        margin: [0, 0, 0, 0],
        borderRadius: 8,
        minHeight: 100,
        width: 300,
        height: 200,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        visible: true,
        boxShadow: null,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 0,
        display: 'flex',
        textAlign: 'left'
    },
    related: {
        settings: ContainerSettings
    }
};
