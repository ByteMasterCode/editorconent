import React, { useState, useEffect } from 'react';
import { useComponentSelection } from '../hooks/useComponentSelection';
import {
    Settings,
    Eye,
    Move,
    Copy,
    ChevronDown,
    ChevronRight,
    Hash,
    Type,
    Palette,
    Maximize
} from 'lucide-react';

export const ComponentPropertiesDisplay = () => {
    const {
        selectedId,
        selectedComponent,
        isSelectionPersistent,
        clearSelection,
        getComponentProperties
    } = useComponentSelection();

    const [expandedGroups, setExpandedGroups] = useState(new Set(['basic']));
    const [propertyGroups, setPropertyGroups] = useState([]);

    useEffect(() => {
        if (!selectedId) {
            setPropertyGroups([]);
            return;
        }

        const componentProps = getComponentProperties();
        if (!componentProps) return;

        const groups = [];

        const basicProps = [];
        if (componentProps.props.text) {
            basicProps.push({ key: 'text', value: componentProps.props.text, type: 'string' });
        }
        if (componentProps.props.src) {
            basicProps.push({ key: 'src', value: componentProps.props.src, type: 'string' });
        }
        if (componentProps.props.alt) {
            basicProps.push({ key: 'alt', value: componentProps.props.alt, type: 'string' });
        }
        if (basicProps.length > 0) {
            groups.push({
                name: 'Basic',
                icon: Type,
                properties: basicProps
            });
        }

        const styleProps = [];
        if (componentProps.props.color) {
            styleProps.push({ key: 'color', value: componentProps.props.color, type: 'color' });
        }
        if (componentProps.props.backgroundColor) {
            styleProps.push({ key: 'backgroundColor', value: componentProps.props.backgroundColor, type: 'color' });
        }
        if (componentProps.props.fontSize) {
            styleProps.push({ key: 'fontSize', value: componentProps.props.fontSize, type: 'number' });
        }
        if (componentProps.props.borderRadius) {
            styleProps.push({ key: 'borderRadius', value: componentProps.props.borderRadius, type: 'number' });
        }
        if (styleProps.length > 0) {
            groups.push({
                name: 'Style',
                icon: Palette,
                properties: styleProps
            });
        }

        const layoutProps = [];
        if (componentProps.props.width) {
            layoutProps.push({ key: 'width', value: componentProps.props.width, type: 'number' });
        }
        if (componentProps.props.height) {
            layoutProps.push({ key: 'height', value: componentProps.props.height, type: 'number' });
        }
        if (componentProps.props.margin) {
            layoutProps.push({ key: 'margin', value: componentProps.props.margin, type: 'array' });
        }
        if (componentProps.props.padding) {
            layoutProps.push({ key: 'padding', value: componentProps.props.padding, type: 'array' });
        }
        if (layoutProps.length > 0) {
            groups.push({
                name: 'Layout',
                icon: Maximize,
                properties: layoutProps
            });
        }

        const advancedProps = Object.entries(componentProps.props)
            .filter(([key]) =>
                !['text', 'src', 'alt', 'color', 'backgroundColor', 'fontSize', 'borderRadius', 'width', 'height', 'margin', 'padding'].includes(key)
            )
            .map(([key, value]) => ({
                key,
                value,
                type:
                    typeof value === 'boolean'
                        ? 'boolean'
                        : typeof value === 'number'
                            ? 'number'
                            : Array.isArray(value)
                                ? 'array'
                                : typeof value === 'object'
                                    ? 'object'
                                    : 'string'
            }));

        if (advancedProps.length > 0) {
            groups.push({
                name: 'Advanced',
                icon: Settings,
                properties: advancedProps
            });
        }

        setPropertyGroups(groups);
    }, [selectedId, getComponentProperties]);

    const toggleGroup = (groupName) => {
        setExpandedGroups((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(groupName)) {
                newSet.delete(groupName);
            } else {
                newSet.add(groupName);
            }
            return newSet;
        });
    };

    const formatValue = (value, type) => {
        switch (type) {
            case 'boolean':
                return value ? 'true' : 'false';
            case 'array':
                return Array.isArray(value) ? `[${value.join(', ')}]` : String(value);
            case 'object':
                return JSON.stringify(value, null, 2);
            default:
                return String(value);
        }
    };

    const getValueColor = (type) => {
        switch (type) {
            case 'string':
                return 'text-green-400';
            case 'number':
                return 'text-blue-400';
            case 'boolean':
                return 'text-purple-400';
            case 'color':
                return 'text-pink-400';
            case 'array':
                return 'text-yellow-400';
            case 'object':
                return 'text-orange-400';
            default:
                return 'text-gray-300';
        }
    };

    if (!isSelectionPersistent || !selectedId) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                        <Settings className="w-8 h-8 text-gray-500" />
                    </div>
                    <h4 className="text-white font-medium mb-2">No Component Selected</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Select a component to view its properties and make adjustments.
                    </p>
                </div>
            </div>
        );
    }

    const componentProps = getComponentProperties();
    if (!componentProps) return null;

    return (
        <div className="flex-1 overflow-y-auto animate-in">
            {/* Component Header */}
            <div className="p-4 border-b border-gray-800/50">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold text-sm">{componentProps.name}</h4>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                                <Move className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={clearSelection}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <Eye className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-gray-400">
                            <span className="text-gray-500">Type:</span>
                            <span className="text-blue-400 ml-1 font-mono">{componentProps.type}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                            <span className="text-gray-500">ID:</span>
                            <span className="text-gray-300 ml-1 font-mono">
                {componentProps.id.slice(0, 12)}...
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Groups */}
            <div className="p-4 space-y-3">
                {propertyGroups.map((group) => {
                    const isExpanded = expandedGroups.has(group.name);
                    const Icon = group.icon;

                    return (
                        <div key={group.name} className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
                            <button
                                onClick={() => toggleGroup(group.name)}
                                className="w-full p-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-white">{group.name}</span>
                                    <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded font-mono">
                    {group.properties.length}
                  </span>
                                </div>
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="border-t border-gray-700/50 p-3 space-y-2">
                                    {group.properties.map((prop) => (
                                        <div key={prop.key} className="flex items-start justify-between py-2">
                                            <div className="flex-1 min-w-0 mr-3">
                                                <div className="text-xs font-medium text-gray-300 mb-1">{prop.key}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">
                                                    {prop.type}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {prop.type === 'color' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded border border-gray-600"
                                                            style={{ backgroundColor: prop.value }}
                                                        />
                                                        <span className={`text-xs font-mono ${getValueColor(prop.type)}`}>
                              {prop.value}
                            </span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`text-xs font-mono ${getValueColor(prop.type)} break-all`}
                                                    >
                                                        {formatValue(prop.value, prop.type)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {propertyGroups.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-3 mx-auto">
                            <Hash className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-sm">
                            No properties available for this component
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
