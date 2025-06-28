import React from 'react';
import { useNode } from '@craftjs/core';
import { ShapeSettings } from './ShapeSettings';

export const Shape = ({
                          type = 'circle',
                          width = 100,
                          height = 100,
                          backgroundColor = '#3B82F6',
                          borderRadius = 0,
                          margin = [0, 0, 0, 0]
                      }) => {
    const {
        connectors: { connect, drag },
        actions: { setProp },
        selected,
        props
    } = useNode((node) => ({
        selected: node.events.selected,
        props: node.data.props
    }));

    const directions = [
        { dir: 'nw', style: { top: 0, left: 0, transform: 'translate(-50%, -50%)', cursor: 'nwse-resize' } },
        { dir: 'n', style: { top: 0, left: '50%', transform: 'translate(-50%, -50%)', cursor: 'ns-resize' } },
        { dir: 'ne', style: { top: 0, right: 0, transform: 'translate(50%, -50%)', cursor: 'nesw-resize' } },
        { dir: 'e', style: { top: '50%', right: 0, transform: 'translate(50%, -50%)', cursor: 'ew-resize' } },
        { dir: 'se', style: { bottom: 0, right: 0, transform: 'translate(50%, 50%)', cursor: 'nwse-resize' } },
        { dir: 's', style: { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', cursor: 'ns-resize' } },
        { dir: 'sw', style: { bottom: 0, left: 0, transform: 'translate(-50%, 50%)', cursor: 'nesw-resize' } },
        { dir: 'w', style: { top: '50%', left: 0, transform: 'translate(-50%, -50%)', cursor: 'ew-resize' } }
    ];

    const handleResize = (dir) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = props.width;
        const startHeight = props.height;

        const mouseMove = (e) => {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;
            let newWidth = startWidth;
            let newHeight = startHeight;

            if (dir.includes('e')) newWidth = Math.max(20, startWidth + dx);
            if (dir.includes('s')) newHeight = Math.max(20, startHeight + dy);
            if (dir.includes('w')) newWidth = Math.max(20, startWidth - dx);
            if (dir.includes('n')) newHeight = Math.max(20, startHeight - dy);

            setProp((p) => {
                p.width = newWidth;
                p.height = newHeight;
            });
        };

        const mouseUp = () => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        };

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    };

    const renderShape = () => {
        const style = { width: '100%', height: '100%', backgroundColor };

        switch (type) {
            case 'circle':
                return <div style={{ ...style, borderRadius: '50%' }} />;
            case 'square':
                return <div style={style} />;
            case 'rectangle':
                return <div style={{ ...style, borderRadius }} />;
            case 'ellipse':
                return (
                    <svg width="100%" height="100%">
                        <ellipse cx="50%" cy="50%" rx="48%" ry="48%" fill={backgroundColor} />
                    </svg>
                );
            case 'triangle':
                return (
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon points="0,100 50,0 100,100" fill={backgroundColor} />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            style={{
                margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                width,
                height,
                position: 'relative',
                border: selected ? '1px dashed #3b82f6' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {renderShape()}

            {selected &&
                directions.map(({ dir, style }) => (
                    <div
                        key={dir}
                        onMouseDown={handleResize(dir)}
                        style={{
                            position: 'absolute',
                            width: 10,
                            height: 10,
                            backgroundColor: '#3B82F6',
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                            zIndex: 10,
                            ...style
                        }}
                    />
                ))}
        </div>
    );
};

Shape.craft = {
    displayName: 'Shape',
    props: {
        type: 'circle',
        width: 100,
        height: 100,
        backgroundColor: '#3B82F6',
        borderRadius: 0,
        margin: [0, 0, 0, 0]
    },
    related: {
        settings: ShapeSettings
    }
};
