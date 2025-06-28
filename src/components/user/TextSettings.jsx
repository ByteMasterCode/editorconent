import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
    Type,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Palette,
    Plus,
    Minus,
    Eye,
    CornerUpLeft,
    Move,
    RotateCcw
} from 'lucide-react';

export const TextSettings = () => {
    const {
        actions: { setProp },
        props
    } = useNode(node => ({
        props: node.data.props
    }));

    const [showColorPicker, setShowColorPicker] = useState(false);

    const NumberInput = ({ label, value, onChange, suffix = '', min = 0, max = 9999 }) => (
        <div className="flex items-center justify-between">
      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
        {label}
      </span>
            <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 min-w-[65px] border border-gray-600/50">
                <input
                    type="number"
                    value={value || 0}
                    min={min}
                    max={max}
                    onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
                    className="bg-transparent text-white text-xs w-full text-right outline-none font-mono"
                />
                {suffix && (
                    <span className="text-gray-400 text-[10px] ml-1 font-medium">{suffix}</span>
                )}
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

    const CustomColorPicker = () => (
        <div className="space-y-3">
            <div className="relative">
                <input
                    type="color"
                    value={props.color || '#333333'}
                    onChange={e => setProp(p => (p.color = e.target.value))}
                    className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-xs font-mono">{props.color || '#333333'}</span>
                </div>
            </div>
            <div className="grid grid-cols-8 gap-1">
                {[
                    '#000000',
                    '#374151',
                    '#6b7280',
                    '#9ca3af',
                    '#d1d5db',
                    '#f3f4f6',
                    '#ffffff',
                    '#ef4444',
                    '#f97316',
                    '#f59e0b',
                    '#eab308',
                    '#84cc16',
                    '#22c55e',
                    '#10b981',
                    '#06b6d4',
                    '#0ea5e9',
                    '#3b82f6',
                    '#6366f1',
                    '#8b5cf6',
                    '#a855f7',
                    '#d946ef',
                    '#ec4899'
                ].map(color => (
                    <button
                        key={color}
                        onClick={() => setProp(p => (p.color = color))}
                        className="w-6 h-6 rounded border border-gray-600/50 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            {/* Typography Section */}
            <div>
                <SectionHeader title="Typography" rightIcon={<IconButton icon={Type} size="sm" />} />

                {/* Font Size */}
                <div className="mb-4">
                    <NumberInput
                        label="Size"
                        value={props.fontSize}
                        onChange={val => setProp(p => (p.fontSize = val))}
                        suffix="px"
                        min={8}
                        max={200}
                    />
                </div>

                {/* Font Weight & Style */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Weight & Style
                    </div>
                    <div className="flex gap-1 mb-3">
                        <IconButton
                            icon={Bold}
                            active={props.fontWeight === 'bold'}
                            onClick={() =>
                                setProp(p => (p.fontWeight = p.fontWeight === 'bold' ? 'normal' : 'bold'))
                            }
                        />
                        <IconButton icon={Italic} />
                        <IconButton icon={Underline} />

                        <div className="w-px bg-gray-600 mx-1.5"></div>

                        <select
                            value={props.fontWeight}
                            onChange={e => setProp(p => (p.fontWeight = e.target.value))}
                            className="bg-gray-700/80 border border-gray-600/50 rounded-md px-2 py-1 text-xs text-white flex-1"
                        >
                            <option value="normal">Regular</option>
                            <option value="semibold">Semibold</option>
                            <option value="bold">Bold</option>
                        </select>
                    </div>
                </div>

                {/* Text Alignment */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Alignment
                    </div>
                    <div className="flex gap-1">
                        <IconButton
                            icon={AlignLeft}
                            active={props.textAlign === 'left'}
                            onClick={() => setProp(p => (p.textAlign = 'left'))}
                        />
                        <IconButton
                            icon={AlignCenter}
                            active={props.textAlign === 'center'}
                            onClick={() => setProp(p => (p.textAlign = 'center'))}
                        />
                        <IconButton
                            icon={AlignRight}
                            active={props.textAlign === 'right'}
                            onClick={() => setProp(p => (p.textAlign = 'right'))}
                        />
                        <IconButton icon={AlignJustify} />
                    </div>
                </div>
            </div>

            <Divider />

            {/* Dimensions Section */}
            <div>
                <SectionHeader title="Dimensions" />
                <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                            label="W"
                            value={props.width}
                            onChange={val => setProp(p => (p.width = val))}
                            suffix="px"
                            min={10}
                        />
                        <NumberInput
                            label="H"
                            value={props.height}
                            onChange={val => setProp(p => (p.height = val))}
                            suffix="px"
                            min={10}
                        />
                    </div>
                </div>
            </div>

            <Divider />

            {/* Fill Section */}
            <div>
                <SectionHeader title="Fill" rightIcon={<IconButton icon={Plus} size="sm" />} />

                {/* Color Fill */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview color={props.color} onClick={() => setShowColorPicker(!showColorPicker)} />
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

                {showColorPicker && <CustomColorPicker />}
            </div>
        </div>
    );
};
