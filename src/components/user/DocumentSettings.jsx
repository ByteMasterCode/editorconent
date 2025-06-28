import React from 'react';
import { useNode } from '@craftjs/core';
import { FileText, Eye, CornerUpLeft, Maximize } from 'lucide-react';

export const DocumentSettings = () => {
    const {
        actions: { setProp },
        props
    } = useNode(node => ({
        props: node.data.props
    }));

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

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            {/* Document Section */}
            <div>
                <SectionHeader
                    title="Document"
                    rightIcon={<IconButton icon={FileText} size="sm" />}
                />

                {/* File Info */}
                {props.fileName && (
                    <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                        <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">
                            Current File
                        </div>
                        <div className="text-xs text-white font-medium truncate">
                            {props.fileName}
                        </div>
                        {props.fileType && (
                            <div className="text-[10px] text-gray-400 mt-1">
                                {props.fileType}
                            </div>
                        )}
                    </div>
                )}

                {/* Display Name */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Display Name
                    </div>
                    <input
                        type="text"
                        value={props.fileName || ''}
                        onChange={e => setProp(p => p.fileName = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white text-xs placeholder-gray-400"
                        placeholder="Document name"
                    />
                </div>

                {/* Options */}
                <div className="space-y-3">
                    <ToggleSwitch
                        checked={props.showToolbar}
                        onChange={val => setProp(p => p.showToolbar = val)}
                        label="Show Toolbar"
                    />
                    <ToggleSwitch
                        checked={props.allowDownload}
                        onChange={val => setProp(p => p.allowDownload = val)}
                        label="Allow Download"
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
                            value={props.width}
                            onChange={val => setProp(p => p.width = val)}
                            suffix="px"
                            min={300}
                        />
                        <NumberInput
                            label="H"
                            value={props.height}
                            onChange={val => setProp(p => p.height = val)}
                            suffix="px"
                            min={200}
                        />
                    </div>
                </div>
            </div>

            <Divider />

            {/* Appearance Section */}
            <div>
                <SectionHeader
                    title="Appearance"
                    rightIcon={<IconButton icon={Eye} size="sm" />}
                />
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
            </div>
        </div>
    );
};
