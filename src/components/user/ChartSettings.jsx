import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
    BarChart3, PieChart, LineChart, Activity, TrendingUp,
    Palette, Plus, Minus, Eye, CornerUpLeft, Maximize
} from 'lucide-react';

export const ChartSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

    const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
    const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);

    const NumberInput = ({ label, value, onChange, suffix = '', min = 0, max = 9999 }) => (
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{label}</span>
            <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 min-w-[65px] border border-gray-600/50">
                <input
                    type="number"
                    value={value || 0}
                    min={min}
                    max={max}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-white text-xs w-full text-right outline-none font-mono"
                />
                {suffix && <span className="text-gray-400 text-[10px] ml-1 font-medium">{suffix}</span>}
            </div>
        </div>
    );

    const IconButton = ({ icon: Icon, active = false, onClick, size = "sm" }) => (
        <button
            onClick={onClick}
            className={`
        ${size === "sm" ? "p-1.5 w-7 h-7" : "p-2 w-8 h-8"} 
        rounded-md transition-all duration-200 flex items-center justify-center
        ${active
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600/50'}
      `}
        >
            <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        </button>
    );

    const SectionHeader = ({ title, rightIcon }) => (
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
            {rightIcon && <div className="flex items-center gap-1">{rightIcon}</div>}
        </div>
    );

    const Divider = () => <div className="border-t border-gray-700/60 my-5" />;

    const ToggleSwitch = ({ checked, onChange, label }) => (
        <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 font-medium">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    checked ? 'bg-blue-500' : 'bg-gray-600'
                }`}
            >
        <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                checked ? 'translate-x-5' : 'translate-x-1'
            }`}
        />
            </button>
        </div>
    );

    const ColorPreview = ({ color, onClick }) => (
        <button
            onClick={onClick}
            className="w-8 h-6 rounded-md border-2 border-gray-600/50 relative overflow-hidden group hover:border-gray-500 transition-colors"
            style={{ backgroundColor: color }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
        </button>
    );

    const CustomColorPicker = ({ value, onChange }) => (
        <div className="space-y-3">
            <div className="relative">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-xs font-mono">{value}</span>
                </div>
            </div>
            <div className="grid grid-cols-8 gap-1">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
                    '#1d4ed8', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#0891b2', '#65a30d']
                    .map((color) => (
                        <button
                            key={color}
                            onClick={() => onChange(color)}
                            className="w-6 h-6 rounded border border-gray-600/50 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                        />
                    ))}
            </div>
        </div>
    );

    const addDataPoint = () => {
        const newData = [...(props.data || []), { label: `Item ${props.data.length + 1}`, value: 50, value2: 30 }];
        setProp((p) => p.data = newData);
    };

    const removeDataPoint = (index) => {
        const newData = props.data.filter((_, i) => i !== index);
        setProp((p) => p.data = newData);
    };

    const updateDataPoint = (index, field, value) => {
        const newData = [...props.data];
        newData[index] = { ...newData[index], [field]: value };
        setProp((p) => p.data = newData);
    };

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            <div>
                <SectionHeader title="Chart" rightIcon={<IconButton icon={TrendingUp} size="sm" />} />

                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Title</div>
                    <input
                        type="text"
                        value={props.title || ''}
                        onChange={(e) => setProp((p) => p.title = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white text-xs placeholder-gray-400"
                        placeholder="Chart title"
                    />
                </div>

                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Type</div>
                    <div className="grid grid-cols-3 gap-1">
                        {[
                            { type: 'bar', icon: BarChart3, label: 'Bar' },
                            { type: 'line', icon: LineChart, label: 'Line' },
                            { type: 'pie', icon: PieChart, label: 'Pie' },
                            { type: 'doughnut', icon: PieChart, label: 'Donut' },
                            { type: 'area', icon: Activity, label: 'Area' }
                        ].map(({ type, icon: Icon, label }) => (
                            <button
                                key={type}
                                onClick={() => setProp((p) => p.type = type)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-md text-xs transition-all ${
                                    props.type === type
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 border border-gray-600/50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <ToggleSwitch
                        checked={props.showLegend !== false}
                        onChange={(val) => setProp((p) => p.showLegend = val)}
                        label="Show Legend"
                    />
                    <ToggleSwitch
                        checked={props.showGrid !== false}
                        onChange={(val) => setProp((p) => p.showGrid = val)}
                        label="Show Grid"
                    />
                    <ToggleSwitch
                        checked={props.animated !== false}
                        onChange={(val) => setProp((p) => p.animated = val)}
                        label="Animated"
                    />
                </div>
            </div>

            <Divider />

            <div>
                <SectionHeader title="Data" rightIcon={<IconButton icon={Plus} size="sm" onClick={addDataPoint} />} />
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(props.data || []).map((item, index) => (
                        <div key={index} className="bg-gray-700/50 rounded-md p-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-300 font-medium">Item {index + 1}</span>
                                <button
                                    onClick={() => removeDataPoint(index)}
                                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={item.label || ''}
                                    onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                                    className="px-2 py-1 bg-gray-600/50 border border-gray-600/50 rounded text-xs text-white placeholder-gray-400"
                                    placeholder="Label"
                                />
                                <input
                                    type="number"
                                    value={item.value || 0}
                                    onChange={(e) => updateDataPoint(index, 'value', parseInt(e.target.value) || 0)}
                                    className="px-2 py-1 bg-gray-600/50 border border-gray-600/50 rounded text-xs text-white"
                                    placeholder="Value"
                                />
                                <input
                                    type="number"
                                    value={item.value2 || 0}
                                    onChange={(e) => updateDataPoint(index, 'value2', parseInt(e.target.value) || 0)}
                                    className="px-2 py-1 bg-gray-600/50 border border-gray-600/50 rounded text-xs text-white"
                                    placeholder="Value 2"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Divider />

            {/* Colors */}
            <div>
                <SectionHeader title="Colors" rightIcon={<IconButton icon={Palette} size="sm" />} />

                {/* Primary */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview
                            color={props.primaryColor || '#3b82f6'}
                            onClick={() => setShowPrimaryColorPicker(!showPrimaryColorPicker)}
                        />
                        <span className="text-xs text-white font-medium">Primary</span>
                    </div>
                </div>
                {showPrimaryColorPicker && (
                    <div className="mb-4">
                        <CustomColorPicker
                            value={props.primaryColor || '#3b82f6'}
                            onChange={(color) => setProp((p) => p.primaryColor = color)}
                        />
                    </div>
                )}

                {/* Secondary */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview
                            color={props.secondaryColor || '#10b981'}
                            onClick={() => setShowSecondaryColorPicker(!showSecondaryColorPicker)}
                        />
                        <span className="text-xs text-white font-medium">Secondary</span>
                    </div>
                </div>
                {showSecondaryColorPicker && (
                    <div className="mb-4">
                        <CustomColorPicker
                            value={props.secondaryColor || '#10b981'}
                            onChange={(color) => setProp((p) => p.secondaryColor = color)}
                        />
                    </div>
                )}

                {/* Background */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview
                            color={props.backgroundColor || '#ffffff'}
                            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                        />
                        <span className="text-xs text-white font-medium">Background</span>
                    </div>
                </div>
                {showBgColorPicker && (
                    <CustomColorPicker
                        value={props.backgroundColor || '#ffffff'}
                        onChange={(color) => setProp((p) => p.backgroundColor = color)}
                    />
                )}
            </div>

            <Divider />

            <div>
                <SectionHeader title="Dimensions" rightIcon={<IconButton icon={Maximize} size="sm" />} />
                <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                            label="W"
                            value={props.width || 500}
                            onChange={(val) => setProp((p) => p.width = val)}
                            suffix="px"
                            min={300}
                        />
                        <NumberInput
                            label="H"
                            value={props.height || 300}
                            onChange={(val) => setProp((p) => p.height = val)}
                            suffix="px"
                            min={200}
                        />
                    </div>
                </div>
            </div>

            <Divider />

            <div>
                <SectionHeader title="Appearance" rightIcon={<IconButton icon={Eye} size="sm" />} />
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Corner radius</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 border border-gray-600/50">
                                <CornerUpLeft className="w-3.5 h-3.5 text-gray-400 mr-2" />
                                <input
                                    type="number"
                                    value={props.borderRadius || 12}
                                    onChange={(e) => setProp((p) => p.borderRadius = parseInt(e.target.value) || 0)}
                                    className="bg-transparent text-white text-xs w-8 text-right outline-none font-mono"
                                    min={0}
                                    max={50}
                                />
                                <span className="text-gray-400 text-[10px] ml-1 font-medium">px</span>
                            </div>
                            <IconButton icon={CornerUpLeft} size="sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
