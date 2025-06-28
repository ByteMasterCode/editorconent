// LayerPanel.jsx
import React, { useState, useCallback } from 'react';
import { useEditor } from '@craftjs/core';
import {
    Square,
    Type,
    MousePointer,
    Code,
    Image as ImageIcon,
    Video as VideoIcon,
    Music,
    Globe,
    BarChart3,
    FileText,
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Copy,
    Trash2
} from 'lucide-react';

const ICON_MAP = {
    Text: Type,
    Button: MousePointer,
    Container: Square,
    CodeBlock: Code,
    Image: ImageIcon,
    Video: VideoIcon,
    Audio: Music,
    Iframe: Globe,
    Chart: BarChart3,
    Document: FileText
};

export const LayerPanel = () => {
    const {
        query,
        actions,
        selected: selectedId
    } = useEditor((state, query) => ({
        selected: query.getEvent('selected').last()
    }));

    // Храним, какие узлы «свернуты»
    const [collapsed, setCollapsed] = useState({});

    // Рекурсивно рендерим дерево узлов
    const renderNode = useCallback((nodeId, depth = 0) => {
        const node = query.node(nodeId).get();
        const { displayName, nodes, hidden, locked } = node.data;
        const isSelected = selectedId === nodeId;
        const Icon = ICON_MAP[displayName] || Square;
        const hasChildren = nodes.length > 0;
        const isCollapsed = collapsed[nodeId];

        const paddingLeft = 12 + depth * 16;

        return (
            <div key={nodeId} className="group">
                <div
                    className={[
                        'flex items-center justify-between py-1 px-2 rounded transition-colors',
                        isSelected ? 'bg-blue-600/20' : 'hover:bg-gray-700/30'
                    ].join(' ')}
                    style={{ paddingLeft }}
                    onClick={e => { e.stopPropagation(); actions.selectNode(nodeId); }}
                >
                    <div className="flex items-center gap-1">
                        {hasChildren && (
                            <button
                                onClick={e => { e.stopPropagation(); setCollapsed(c => ({ ...c, [nodeId]: !isCollapsed })); }}
                                className="p-1"
                                title={isCollapsed ? 'Expand' : 'Collapse'}
                            >
                                {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </button>
                        )}
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                        <span className={`${isSelected ? 'text-white font-medium' : 'text-gray-200'}`}>
              {displayName}
            </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={e => { e.stopPropagation(); actions.setHidden(nodeId, !hidden); }}
                            title={hidden ? 'Show' : 'Hide'}
                        >
                            {hidden ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                const n = query.node(nodeId).get();
                                actions.setProp(nodeId, props => { props.locked = !n.data.locked; });
                            }}
                            title={locked ? 'Unlock' : 'Lock'}
                        >
                            {locked ? <Unlock className="w-4 h-4 text-gray-400" /> : <Lock className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button onClick={e => { e.stopPropagation(); actions.copy(nodeId); }} title="Duplicate">
                            <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                const nq = query.node(nodeId);
                                if (nq.exists() && nq.isDeletable()) actions.delete(nodeId);
                            }}
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </div>

                {/* Дочерние узлы */}
                {hasChildren && !isCollapsed && (
                    <div>
                        {nodes.map(childId => renderNode(childId, depth + 1))}
                    </div>
                )}
            </div>
        );
    }, [query, actions, selectedId, collapsed]);

    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 w-80 flex flex-col">
            {/* Заголовок */}
            <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Layers</h3>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded font-mono">
          { /* Количество всех узлов, кроме ROOT */ }
                    {Object.keys(query.getNodes()).length - 1}
        </span>
            </div>

            {/* Список слоёв */}
            <div className="flex-1 overflow-auto">
                {renderNode('ROOT')}
            </div>
        </div>
    );
};
