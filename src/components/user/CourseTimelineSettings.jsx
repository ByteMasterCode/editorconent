import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { BookOpen, Eye, CornerUpLeft, Maximize, Clock, Palette } from 'lucide-react';

export const CourseTimelineSettings = () => {
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
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
        </button>
    );

    const CustomColorPicker = () => (
        <div className="space-y-3">
            <div className="relative">
                <input
                    type="color"
                    value={props.accentColor}
                    onChange={e => setProp(p => p.accentColor = e.target.value)}
                    className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-xs font-mono">{props.accentColor}</span>
                </div>
            </div>

            <div className="grid grid-cols-8 gap-1">
                {[
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#ec4899',
                    '#06b6d4',
                    '#84cc16'
                ].map(color => (
                    <button
                        key={color}
                        onClick={() => setProp(p => p.accentColor = color)}
                        className="w-6 h-6 rounded border border-gray-600/50 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            {/* Timeline Section */}
            <div>
                <SectionHeader
                    title="Timeline"
                    rightIcon={<IconButton icon={BookOpen} size="sm" />}
                />
                <div className="space-y-3">
                    <ToggleSwitch
                        checked={props.showProgress}
                        onChange={val => setProp(p => p.showProgress = val)}
                        label="Show Progress"
                    />
                    <ToggleSwitch
                        checked={props.showDuration}
                        onChange={val => setProp(p => p.showDuration = val)}
                        label="Show Duration"
                    />
                    <ToggleSwitch
                        checked={props.showLessons}
                        onChange={val => setProp(p => p.showLessons = val)}
                        label="Show Lessons"
                    />
                </div>
            </div>

            <Divider />

            {/* Appearance Section */}
            <div>
                <SectionHeader
                    title="Appearance"
                    rightIcon={<IconButton icon={Palette} size="sm" />}
                />
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview
                            color={props.accentColor}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        />
                        <span className="text-xs text-white font-medium">Accent Color</span>
                    </div>
                </div>
                {showColorPicker && (
                    <div className="mb-4">
                        <CustomColorPicker />
                    </div>
                )}

                {/* Border Radius */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Corner radius
            </span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 border border-gray-600/50">
                                <CornerUpLeft className="w-3.5 h-3.5 text-gray-400 mr-2" />
                                <input
                                    type="number"
                                    value={props.borderRadius}
                                    onChange={e => setProp(p => p.borderRadius = parseInt(e.target.value, 10) || 0)}
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

                <Divider />

                {/* Dimensions Section */}
                <div>
                    <SectionHeader
                        title="Dimensions"
                        rightIcon={<IconButton icon={Maximize} size="sm" />}
                    />
                    <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-3">
                            <NumberInput
                                label="W"
                                value={props.width}
                                onChange={val => setProp(p => p.width = val)}
                                suffix="px"
                                min={400}
                            />
                            <NumberInput
                                label="H"
                                value={props.height}
                                onChange={val => setProp(p => p.height = val)}
                                suffix="px"
                                min={400}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
