import React, { useEffect, useRef } from 'react';
import { Frame, Element, useEditor } from '@craftjs/core';
import { usePagesContext } from '../contexts/PagesContext';
import { Container } from './user/Container';

export const Canvas = () => {
    const { actions } = useEditor();
    const { pages, currentPageId } = usePagesContext();
    const canvasRef = useRef(null);

    // Текущая страница из контекста
    const currentPage = pages.find(p => p.id === currentPageId);

    // 1) Десериализуем на смене страницы или при изменении её content
    useEffect(() => {
        if (currentPage?.content) {
            try {
                actions.deserialize(currentPage.content);
            } catch (err) {
                console.error('Error loading page content:', err);
            }
        }
    }, [actions, currentPageId, currentPage?.content]);

    // 2) Клик по пустому месту сбрасывает выделение
    const handleCanvasClick = e => {
        const isCraftNode    = !!e.target.closest('[data-craftjs-node-id]');
        const isResizeHandle = !!e.target.closest('[data-resize-handle]');
        if (!isCraftNode && !isResizeHandle) {
            actions.selectNode('');
        }
    };

    return (
        <div
            ref={canvasRef}
            className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-6 overflow-auto relative"
            onClick={handleCanvasClick}
        >
            {/* Фоновая сетка — клики через неё проходят */}
            <div
                className="absolute inset-0 opacity-20 canvas-background pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Сам холст */}
            <div className="relative min-h-full bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-200/50 overflow-hidden">
                {/* Шапка */}
                <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium ml-2">
              {currentPage?.title ?? 'Untitled Page'}
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Auto-saved</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Рабочая область */}
                <div className="p-6 canvas-content canvas-frame" style={{ minHeight: 'calc(100vh - 200px)' }}>
                    <Frame data-cy="frame">
                        <Element
                            is={Container}
                            canvas
                            background="#ffffff"
                            padding={[40, 40, 40, 40]}
                            minHeight={600}
                            width={800}
                            height={600}
                            className="min-h-[1000px]"
                        />
                    </Frame>
                </div>
            </div>
        </div>
    );
};
