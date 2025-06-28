import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
    MousePointer,
    Palette,
    Plus,
    Minus,
    Eye,
    CornerUpLeft
} from 'lucide-react';

export const ButtonSettings = () => {
    const {
        actions: { setProp },
        props
    } = useNode((node) => ({
        props: node.data.props
    }));

    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);

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

    const IconButton = ({ icon: Icon, active = false, onClick, size = 'sm' }) => (
        <button
            onClick={onClick}
            className={`
        ${size === 'sm' ? 'p-1.5 w-7 h-7' : 'p-2 w-8 h-8'}
        rounded-md transition-all duration-200 flex items-center justify-center
        ${active
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600/50'}
      `}
        >
            <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
    );

    const SectionHeader = ({ title, rightIcon }) => (
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
            {rightIcon && <div className="flex items-center gap-1">{rightIcon}</div>}
        </div>
    );

    const Divider = () => <div className="border-t border-gray-700/60 my-5" />;

    const ColorPreview = ({ color, onClick }) => (
        <button
            onClick={onClick}
            className="w-8 h-6 rounded-md border-2 border-gray-600/50 relative overflow-hidden group hover:border-gray-500 transition-colors"
            style={{ backgroundColor: color }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
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
                {[
                    '#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
                    '#f59e0b', '#d97706', '#b45309', '#92400e', '#10b981', '#059669', '#047857', '#065f46',
                    '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#ec4899', '#db2777', '#be185d', '#9d174d'
                ].map((color) => (
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

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            <div>
                <SectionHeader
                    title="Button"
                    rightIcon={<IconButton icon={MousePointer} size="sm" />}
                />
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Size</div>
                    <div className="flex gap-1">
                        {['sm', 'md', 'lg'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setProp((p) => p.size = s)}
                                className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                                    props.size === s
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 border border-gray-600/50'
                                }`}
                            >
                                {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2.5 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                            label="W"
                            value={props.width || 120}
                            onChange={(val) => setProp((p) => p.width = val)}
                            suffix="px"
                            min={50}
                        />
                        <NumberInput
                            label="H"
                            value={props.height || 40}
                            onChange={(val) => setProp((p) => p.height = val)}
                            suffix="px"
                            min={30}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Corner radius</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 border border-gray-600/50">
                                <CornerUpLeft className="w-3.5 h-3.5 text-gray-400 mr-2" />
                                <input
                                    type="number"
                                    value={props.borderRadius || 8}
                                    onChange={(e) => setProp((p) => p.borderRadius = parseInt(e.target.value) || 0)}
                                    className="bg-transparent text-white text-xs w-8 text-right outline-none font-mono"
                                    min={0}
                                    max={50}
                                />
                                <span className="text-gray-400 text-[10px] ml-1 font-medium">px</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Divider />

            <div>
                <SectionHeader
                    title="Fill"
                    rightIcon={<IconButton icon={Plus} size="sm" />}
                />

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview
                            color={props.backgroundColor || '#3B82F6'}
                            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                        />
                        <span className="text-xs text-white font-medium">Background</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 border border-gray-600/50">
                            <span className="text-white text-xs font-mono">100</span>
                            <span className="text-gray-400 text-[10px] ml-1 font-medium">%</span>
                        </div>
                        <IconButton icon={Eye} size="sm" />
                        <IconButton icon={Minus} size="sm" />
                    </div>
                </div>

                {showBgColorPicker && (
                    <div className="mb-4">
                        <CustomColorPicker
                            value={props.backgroundColor || '#3B82F6'}
                            onChange={(color) => setProp((p) => p.backgroundColor = color)}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview
                            color={props.color || '#ffffff'}
                            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                        />
                        <span className="text-xs text-white font-medium">Text</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 border border-gray-600/50">
                            <span className="text-white text-xs font-mono">100</span>
                            <span className="text-gray-400 text-[10px] ml-1 font-medium">%</span>
                        </div>
                        <IconButton icon={Eye} size="sm" />
                        <IconButton icon={Minus} size="sm" />
                    </div>
                </div>

                {showTextColorPicker && (
                    <CustomColorPicker
                        value={props.color || '#ffffff'}
                        onChange={(color) => setProp((p) => p.color = color)}
                    />
                )}
            </div>
        </div>
    );
};
