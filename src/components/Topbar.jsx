import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { usePagesContext } from '../contexts/PagesContext';
import {
    Undo,
    Redo,
    Eye,
    Code,
    Download,
    Upload,
    Monitor,
    Tablet,
    Smartphone,
    Play,
    Zap,
    Share2,
    Save,
    ChevronLeft,
    ChevronRight, KeyboardIcon
} from 'lucide-react';
import { PreviewMode } from './PreviewMode';
import {HotkeySettingsModal} from "./HotkeySettingsModal";

export const Topbar = () => {
    // Берём actions, query и enabled из editor
    const { actions, query, enabled } = useEditor(state => ({
        enabled: state.options.enabled
    }));
    // А canUndo/canRedo получаем через query.history
    const canUndo = query.history.canUndo();
    const canRedo = query.history.canRedo();
    const [isHotkeyModalOpen, setHotkeyModalOpen] = useState(false);

    const {
        pages,
        currentPageId,
        currentPageIndex,
        nextPage,
        prevPage,
        canGoNext,
        canGoPrev,
        updatePage
    } = usePagesContext();

    const [viewMode, setViewMode] = useState('desktop');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const exportJSON = () => {
        const json = query.serialize();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'page-design.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const importJSON = e => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                try {
                    const json = ev.target.result;
                    actions.deserialize(json);
                    updatePage(currentPageId, { content: json });
                } catch (err) {
                    console.error('Error importing JSON:', err);
                }
            };
            reader.readAsText(file);
        }
    };

    const saveCurrentPage = () => {
        const content = query.serialize();
        updatePage(currentPageId, { content });
    };

    const currentPage = pages.find(p => p.id === currentPageId);

    const IconButton = ({ icon: Icon, onClick, disabled = false, active = false, className = '' }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        p-2 rounded-lg transition-all duration-200 flex items-center justify-center
        ${active
                ? 'bg-blue-500 text-white shadow-lg'
                : disabled
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'}
        ${className}
      `}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <>
            <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Course Editor
                        </h1>
                    </div>

                    {/* Undo / Redo */}
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                        <IconButton
                            icon={Undo}
                            onClick={() => actions.history.undo()}
                            disabled={!canUndo}
                        />
                        <IconButton
                            icon={Redo}
                            onClick={() => actions.history.redo()}
                            disabled={!canRedo}
                        />
                    </div>

                    {/* Навигация страниц */}
                    <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
                        <IconButton icon={ChevronLeft} onClick={prevPage} disabled={!canGoPrev} />
                        <div className="px-3 py-1 text-sm text-white font-medium">
                            {currentPage?.title} ({currentPageIndex + 1}/{pages.length})
                        </div>
                        <IconButton icon={ChevronRight} onClick={nextPage} disabled={!canGoNext} />
                    </div>
                </div>

                {/* Вид: desktop/tablet/mobile */}
                <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                    {['desktop', 'tablet', 'mobile'].map(mode => {
                        const Icon = mode === 'desktop' ? Monitor : mode === 'tablet' ? Tablet : Smartphone;
                        return (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`
                  p-2 rounded-md transition-all duration-200 flex items-center gap-2
                  ${viewMode === mode
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-medium capitalize">{mode}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Сохранение / Экспорт / Режимы */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <IconButton icon={Save} onClick={saveCurrentPage}/>
                        <IconButton icon={Download} onClick={exportJSON}/>
                        <label>
                            <IconButton icon={Upload} onClick={() => {
                            }}/>
                            <input type="file" accept=".json" onChange={importJSON} className="hidden"/>
                        </label>
                    </div>

                    <button
                        onClick={() => actions.setOptions(opts => {
                            opts.enabled = !enabled;
                        })}
                        className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
              ${enabled
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'}
            `}
                    >
                        {enabled ? <><Eye className="w-4 h-4"/> Preview</>
                            : <><Code className="w-4 h-4"/> Edit</>}
                    </button>
                    <button
                        onClick={() => setHotkeyModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                    >
                        <KeyboardIcon className="w-4 h-4"/>
                        Hotkeys
                    </button>

                    <button
                        onClick={() => {
                            actions.setOptions((opts) => {
                                opts.enabled = false;
                            });
                            setIsPreviewOpen(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                    >
                        <Play className="w-4 h-4"/>
                        Course Preview
                    </button>


                    <button
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg">
                        <Share2 className="w-4 h-4"/>
                        Share
                    </button>
                </div>

                <div className="hidden" data-viewport={viewMode}></div>
            </div>

            <PreviewMode isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}/>
            <HotkeySettingsModal
                isOpen={isHotkeyModalOpen}
                onClose={() => setHotkeyModalOpen(false)}
            />



        </>
    );
};
