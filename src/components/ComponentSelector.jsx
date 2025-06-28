import React, { useState, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import {
    Type,
    Square,
    Code,
    MousePointer,
    Image as ImageIcon,
    Video as VideoIcon,
    Music,
    Globe,
    BarChart3,
    FileText,
    Settings,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Copy,
    Trash2,
    Move
} from 'lucide-react';

export const ComponentSelector = () => {
    const { selected, actions, query } = useEditor((state, query) => {
        const currentNodeId = query.getEvent('selected').last();
        return {
            selected: currentNodeId
        };
    });

    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [persistentSelection, setPersistentSelection] = useState(null);

    const getComponentIcon = (type) => {
        const iconMap = {
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
        return iconMap[type] || Square;
    };

    useEffect(() => {
        const updateComponents = () => {
            const nodes = query.getNodes();
            const componentList = [];

            Object.entries(nodes).forEach(([nodeId, node]) => {
                if (nodeId !== 'ROOT' && node.data.type) {
                    const componentType =
                        typeof node.data.type === 'string'
                            ? node.data.type
                            : node.data.type.resolvedName || 'Unknown';

                    componentList.push({
                        id: nodeId,
                        name: node.data.displayName || componentType,
                        type: componentType,
                        icon: getComponentIcon(componentType),
                        props: node.data.props || {},
                        isSelected: nodeId === persistentSelection,
                        isVisible: !node.data.hidden,
                        isLocked: node.data.locked || false
                    });
                }
            });

            setComponents(componentList);
        };

        updateComponents();
    }, [query, selected, persistentSelection]);

    const handleComponentSelect = (componentId, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const component = components.find((c) => c.id === componentId);
        if (!component) return;

        try {
            if (!query.node(componentId).exists()) {
                clearSelection();
                return;
            }
        } catch {
            clearSelection();
            return;
        }

        setPersistentSelection(componentId);
        setSelectedComponent(component);
        actions.selectNode(componentId);
    };

    const clearSelection = () => {
        setPersistentSelection(null);
        setSelectedComponent(null);
        actions.selectNode('');
    };

    const toggleVisibility = (componentId, event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            if (query.node(componentId).exists()) {
                actions.setHidden(
                    componentId,
                    !components.find((c) => c.id === componentId)?.isVisible
                );
            }
        } catch {
            console.warn('Failed to toggle visibility for component:', componentId);
        }
    };

    const toggleLock = (componentId, event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            if (query.node(componentId).exists()) {
                const node = query.node(componentId).get();
                actions.setProp(componentId, (props) => {
                    props.locked = !node.data.locked;
                });
            }
        } catch {
            console.warn('Failed to toggle lock for component:', componentId);
        }
    };

    const duplicateComponent = (componentId, event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('Duplicate component:', componentId);
    };

    const deleteComponent = (componentId, event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            const nodeQuery = query.node(componentId);
            if (nodeQuery.exists() && nodeQuery.isDeletable()) {
                actions.delete(componentId);
                if (persistentSelection === componentId) {
                    clearSelection();
                }
            } else if (persistentSelection === componentId) {
                clearSelection();
            }
        } catch {
            if (persistentSelection === componentId) {
                clearSelection();
            }
        }
    };

    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 w-80 flex flex-col">
            <div className="p-4 border-b border-gray-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                            <Settings className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">Components</h3>
                        <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded font-mono">
              {components.length}
            </span>
                    </div>
                    {persistentSelection && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                clearSelection();
                            }}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                            title="Clear selection"
                        >
                            <Eye className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Select components to view properties</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-2">
                    {components.map((component) => {
                        const Icon = component.icon;
                        const isCurrentlySelected = persistentSelection === component.id;

                        return (
                            <div
                                key={component.id}
                                className={`group relative transition-all duration-200 ${
                                    isCurrentlySelected ? 'component-wrapper selection-locked animate-in' : 'component-wrapper'
                                }`}
                                data-selected={isCurrentlySelected}
                            >
                                <div
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                        isCurrentlySelected
                                            ? 'bg-blue-500/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-600/60'
                                    }`}
                                    onClick={(e) => handleComponentSelect(component.id, e)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                    isCurrentlySelected
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-700/50 text-gray-300 group-hover:bg-gray-600'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4
                                                    className={`text-sm font-medium truncate ${
                                                        isCurrentlySelected ? 'text-white' : 'text-gray-200'
                                                    }`}
                                                >
                                                    {component.name}
                                                </h4>
                                                <p className="text-xs text-gray-400 truncate">{component.type}</p>
                                            </div>
                                        </div>

                                        <div
                                            className={`flex items-center gap-1 transition-opacity ${
                                                isCurrentlySelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            <button
                                                onClick={(e) => toggleVisibility(component.id, e)}
                                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                title={component.isVisible ? 'Hide' : 'Show'}
                                            >
                                                {component.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            </button>

                                            <button
                                                onClick={(e) => toggleLock(component.id, e)}
                                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                title={component.isLocked ? 'Unlock' : 'Lock'}
                                            >
                                                {component.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                            </button>

                                            <button
                                                onClick={(e) => duplicateComponent(component.id, e)}
                                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>

                                            <button
                                                onClick={(e) => deleteComponent(component.id, e)}
                                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {isCurrentlySelected && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 -z-10"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {components.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                            <Square className="w-8 h-8 text-gray-500" />
                        </div>
                        <h4 className="text-white font-medium mb-2">No Components</h4>
                        <p className="text-gray-400 text-sm">
                            Add components from the toolbox to see them here
                        </p>
                    </div>
                )}
            </div>

            {selectedComponent && (
                <div className="border-t border-gray-800/50 p-4 bg-gray-900/50">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <selectedComponent.icon className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-semibold text-blue-400">{selectedComponent.name}</h4>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-gray-300">
                                <span className="text-gray-500">Type:</span> {selectedComponent.type}
                            </div>
                            <div className="text-xs text-gray-300">
                                <span className="text-gray-500">ID:</span> {selectedComponent.id.slice(0, 8)}...
                            </div>
                            <div className="text-xs text-gray-300">
                                <span className="text-gray-500">Properties:</span> {Object.keys(selectedComponent.props).length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
