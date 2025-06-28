import React, { useEffect, useRef } from 'react';
import { Frame, Element, useEditor } from '@craftjs/core';
import { usePagesContext } from '../contexts/PagesContext';
import { Container } from './user/Container';

export const Canvas = () => {
    const { actions, query } = useEditor();
    const { pages, currentPageId, updatePage } = usePagesContext();
    const canvasRef = useRef(null);

    // Найдём объект текущей страницы в контексте
    const currentPage = pages.find(page => page.id === currentPageId);

    // Десериализуем **только когда мы перешли на новую страницу**
    useEffect(() => {
        if (currentPage?.content) {
            try {
                actions.deserialize(currentPage.content);
            } catch (error) {
                console.error('Error loading page content:', error);
            }
        }
        // Зависимость — только от ID страницы
    }, [currentPageId, actions]);

    // Автосохранение: по таймауту 1 с после любых изменений в редакторе
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage) {
                const content = query.serialize();
                updatePage(currentPageId, { content });
            }
        }, 1000);
        return () => clearTimeout(timer);
        // Зависимости: query (внутренняя serialisation), текущая страница и её ID
    }, [query, currentPageId, currentPage, updatePage]);

    // Сбрасываем выделение **только** если клик не в компонент Craft.js
    const handleCanvasClick = e => {
        if (!e.target.closest('[data-craftjs-node-id]')) {
            actions.selectNode('');
        }
    };

    return (
        <div
            ref={canvasRef}
            className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-6 overflow-auto relative"
            onClick={handleCanvasClick}
        >
            {/* Фоновая сетка */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Основной контейнер Canvas */}
            <div className="relative min-h-full bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-200/50 overflow-hidden">
                {/* Шапка Canvas */}
                <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                            <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium ml-2">
              {currentPage?.title || 'Untitled Page'}
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Auto-saved</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Область редактирования */}
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
                            className="min-h-[600px]"
                        >
                            {/* Здесь будут дочерние компоненты */}
                        </Element>
                    </Frame>
                </div>
            </div>
        </div>
    );
};
