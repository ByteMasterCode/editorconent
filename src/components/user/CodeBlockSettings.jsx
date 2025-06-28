import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
    Code, Eye, CornerUpLeft, Maximize, Hash, Type
} from 'lucide-react';

const LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'css', 'html', 'json',
    'bash', 'sql', 'php', 'go', 'rust', 'cpp', 'csharp', 'ruby'
];

export const CodeBlockSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

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
                : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600/50'
            }
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

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            {/* Code Section */}
            <div>
                <SectionHeader
                    title="Code Block"
                    rightIcon={<IconButton icon={Code} size="sm" />}
                />

                {/* Language */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Language</div>
                    <select
                        value={props.language || 'javascript'}
                        onChange={(e) => setProp((p) => p.language = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white text-xs"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Code Content */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Code</div>
                    <textarea
                        value={props.code || ''}
                        onChange={(e) => setProp((p) => p.code = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white font-mono text-xs resize-none"
                        rows={6}
                        placeholder="Enter your code here..."
                    />
                </div>

                {/* Options */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-3 uppercase tracking-wider font-medium">Options</div>
                    <ToggleSwitch
                        checked={props.showLineNumbers !== false}
                        onChange={(val) => setProp((p) => p.showLineNumbers = val)}
                        label="Show line numbers"
                    />
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
                            value={props.width || 400}
                            onChange={(val) => setProp((p) => p.width = val)}
                            suffix="px"
                            min={200}
                        />
                        <NumberInput
                            label="H"
                            value={props.height || 200}
                            onChange={(val) => setProp((p) => p.height = val)}
                            suffix="px"
                            min={100}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
