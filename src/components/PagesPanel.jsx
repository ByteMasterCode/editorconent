import React, { useState } from 'react';
import { usePagesContext } from '../contexts/PagesContext';
import {
    Plus,
    Copy,
    Trash2,
    Edit3,
    GripVertical,
    FileText,
    Eye,
    EyeOff,
    MoreHorizontal,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export const PagesPanel = () => {
    const {
        pages,
        currentPageId,
        addPage,
        deletePage,
        updatePage,
        setCurrentPage,
        duplicatePage
    } = usePagesContext();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingPageId, setEditingPageId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    const startEditing = (pageId, currentTitle) => {
        setEditingPageId(pageId);
        setEditingTitle(currentTitle);
    };

    const saveEdit = () => {
        if (editingPageId && editingTitle.trim()) {
            updatePage(editingPageId, { title: editingTitle.trim() });
        }
        setEditingPageId(null);
        setEditingTitle('');
    };

    const cancelEdit = () => {
        setEditingPageId(null);
        setEditingTitle('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 w-64 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex items-center justify-center">
                            <FileText className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">Pages</h3>
                        <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded font-mono">
              {pages.length}
            </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => addPage()}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                            title="Add new page"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                        >
                            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
                <p className="text-xs text-gray-400">Manage course pages</p>
            </div>

            {/* Pages List */}
            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto p-3">
                    <div className="space-y-2">
                        {pages.map((page, index) => (
                            <div
                                key={page.id}
                                className={`group relative bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-600/60 rounded-lg transition-all duration-200 ${
                                    currentPageId === page.id ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
                                }`}
                            >
                                {/* Drag Handle */}
                                <div className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical className="w-3 h-3 text-gray-500" />
                                </div>

                                {/* Page Content */}
                                <div
                                    className="p-3 pl-6 cursor-pointer"
                                    onClick={() => setCurrentPage(page.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            {editingPageId === page.id ? (
                                                <input
                                                    type="text"
                                                    value={editingTitle}
                                                    onChange={(e) => setEditingTitle(e.target.value)}
                                                    onBlur={saveEdit}
                                                    onKeyDown={handleKeyPress}
                                                    className="w-full bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded">
                            {index + 1}
                          </span>
                                                    <h4 className="text-sm font-medium text-white truncate">
                                                        {page.title}
                                                    </h4>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          Updated {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                                                {currentPageId === page.id && (
                                                    <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                            Current
                          </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditing(page.id, page.title);
                                                }}
                                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                title="Rename page"
                                            >
                                                <Edit3 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    duplicatePage(page.id);
                                                }}
                                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                title="Duplicate page"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                            {pages.length > 1 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deletePage(page.id);
                                                    }}
                                                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                                                    title="Delete page"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Page Button */}
                    <button
                        onClick={() => addPage()}
                        className="w-full mt-3 p-3 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add New Page</span>
                    </button>
                </div>
            )}

            {/* Quick Stats */}
            <div className="p-3 border-t border-gray-800/50">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-3 h-3 text-blue-400" />
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Course Progress</h4>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        {pages.length} page{pages.length !== 1 ? 's' : ''} created
                    </p>
                </div>
            </div>
        </div>
    );
};
