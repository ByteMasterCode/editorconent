import React, { useState } from 'react';
import { ComponentSelector } from './ComponentSelector';
import { ComponentPropertiesDisplay } from './ComponentPropertiesDisplay';
import {
    Settings,
    List
} from 'lucide-react';

export const EnhancedPropertiesPanel = () => {
    const [activeTab, setActiveTab] = useState('selector');

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
            <div className={`
        w-4 h-4 rounded flex items-center justify-center
        ${activeTab === id ? 'bg-blue-500/20' : 'bg-gray-700/50'}
      `}>
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
            {/* Tab Headers */}
            <div className="border-b border-gray-800/50 flex">
                <TabButton
                    id="selector"
                    icon={List}
                    label="Components"
                />
                <TabButton
                    id="properties"
                    icon={Settings}
                    label="Properties"
                />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'selector' && <ComponentSelector />}
                {activeTab === 'properties' && (
                    <div className="h-full flex flex-col">
                        {/* Properties Header */}
                        <div className="p-4 border-b border-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                                        <Settings className="w-3 h-3 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Properties</h3>
                                </div>
                            </div>
                        </div>

                        {/* Properties Content */}
                        <ComponentPropertiesDisplay />
                    </div>
                )}
            </div>
        </div>
    );
};
