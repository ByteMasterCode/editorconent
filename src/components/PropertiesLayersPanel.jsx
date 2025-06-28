import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import {
    Settings,
    Layers as LayersIcon,
    X,
    Trash2,
    Copy,
    Move,
    Eye,
    Lock,
    Plus
} from 'lucide-react';

export const PropertiesLayersPanel = () => {
    const [activeTab, setActiveTab] = useState('properties');

    const { selected, relatedSettings, actions } = useEditor((state, query) => {
        const currentNodeId = query.getEvent('selected').last();
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
                settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
                isDeletable: query.node(currentNodeId).isDeletable()
            };
        }

        return {
            selected,
            relatedSettings: selected && selected.settings ? React.createElement(selected.settings) : null
        };
    });

    const TabButton = ({ id, icon: Icon, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
        flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 relative
        ${activeTab === id
                ? 'text-white bg-gray-800/60 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
            }
      `}
        >
            <div className={`w-4 h-4 rounded flex items-center justify-center ${
                activeTab === id ? 'bg-blue-500/20' : 'bg-gray-700/50'
            }`}>
                <Icon className="w-3 h-3" />
            </div>
            <span>{label}</span>
            {count && (
                <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded font-mono">
          {count}
        </span>
            )}
        </button>
    );

    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border-l border-gray-800/50 w-80 flex flex-col overflow-hidden">
            <div className="border-b border-gray-800/50 flex">
                <TabButton id="properties" icon={Settings} label="Properties" />
                <TabButton id="layers" icon={LayersIcon} label="Layers" count={3} />
            </div>

            <div className="flex-1 overflow-hidden">
                {activeTab === 'properties' && (
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                                        <Settings className="w-3 h-3 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Properties</h3>
                                </div>
                                {selected && (
                                    <button
                                        onClick={() => actions.selectNode('')}
                                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {selected ? (
                                <div>
                                    <div className="p-4 border-b border-gray-800/50">
                                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-white font-semibold text-sm">{selected.name}</h4>
                                                <div className="flex items-center gap-1">
                                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                                                        <Move className="w-3.5 h-3.5" />
                                                    </button>
                                                    {selected.isDeletable && (
                                                        <button
                                                            onClick={() => actions.delete(selected.id)}
                                                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                ID: <span className="font-mono text-gray-300">{selected.id.slice(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto">{relatedSettings}</div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                            <Settings className="w-8 h-8 text-gray-500" />
                                        </div>
                                        <h4 className="text-white font-medium mb-2">No Selection</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Select an element on the canvas to edit its properties and styling options.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'layers' && (
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-md flex items-center justify-center">
                                        <LayersIcon className="w-3 h-3 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Layers</h3>
                                    <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded font-mono">3</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
                                        <Lock className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-3 overflow-y-auto">
                            <div className="bg-gray-800/30 rounded-xl p-2 border border-gray-700/50">
                                <Layers expandRootOnLoad={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
