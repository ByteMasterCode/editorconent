import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { Globe, Shield, Eye, CornerUpLeft, Maximize, ExternalLink, FileText, Presentation, FileSpreadsheet } from 'lucide-react';

export const IframeSettings = () => {
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

    const QuickPreset = ({ icon: Icon, label, url, onClick }) => (
        <button
            onClick={() => onClick(url)}
            className="flex items-center gap-2 p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-md transition-colors text-left w-full"
        >
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-300">{label}</span>
        </button>
    );

    const setPresetUrl = url => {
        setProp(p => p.src = url);
    };

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            {/* Iframe Section */}
            <div>
                <SectionHeader
                    title="Embed"
                    rightIcon={<IconButton icon={Globe} size="sm" />}
                />

                {/* URL Input */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        URL
                    </div>
                    <input
                        type="text"
                        value={props.src || ''}
                        onChange={e => setProp(p => p.src = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white text-xs placeholder-gray-400"
                        placeholder="https://example.com"
                    />
                </div>

                {/* Title */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Title
                    </div>
                    <input
                        type="text"
                        value={props.title || ''}
                        onChange={e => setProp(p => p.title = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white text-xs placeholder-gray-400"
                        placeholder="Embedded Content"
                    />
                </div>

                {/* Quick Presets */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Quick Presets
                    </div>
                    <div className="space-y-1">
                        <QuickPreset
                            icon={FileText}
                            label="PDF Viewer"
                            url="https://docs.google.com/viewer?url=YOUR_PDF_URL&embedded=true"
                            onClick={setPresetUrl}
                        />
                        <QuickPreset
                            icon={Presentation}
                            label="Google Slides"
                            url="https://docs.google.com/presentation/d/YOUR_PRESENTATION_ID/embed"
                            onClick={setPresetUrl}
                        />
                        <QuickPreset
                            icon={FileSpreadsheet}
                            label="Google Sheets"
                            url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing&widget=true&headers=false"
                            onClick={setPresetUrl}
                        />
                        <QuickPreset
                            icon={ExternalLink}
                            label="YouTube Embed"
                            url="https://www.youtube.com/embed/VIDEO_ID"
                            onClick={setPresetUrl}
                        />
                    </div>
                </div>

                {/* Loading */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Loading
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setProp(p => p.loading = 'lazy')}
                            className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                                props.loading === 'lazy'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 border border-gray-600/50'
                            }`}
                        >
                            Lazy
                        </button>
                        <button
                            onClick={() => setProp(p => p.loading = 'eager')}
                            className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                                props.loading === 'eager'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 border border-gray-600/50'
                            }`}
                        >
                            Eager
                        </button>
                    </div>
                </div>
            </div>

            <Divider />

            {/* Security Section */}
            <div>
                <SectionHeader
                    title="Security"
                    rightIcon={<IconButton icon={Shield} size="sm" />}
                />

                {/* Sandbox */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Sandbox
                    </div>
                    <textarea
                        value={props.sandbox || ''}
                        onChange={e => setProp(p => p.sandbox = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white text-xs resize-none"
                        rows={3}
                        placeholder="allow-scripts allow-same-origin allow-forms"
                    />
                    <div className="text-[10px] text-gray-500 mt-1">
                        Controls iframe permissions for security
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    <ToggleSwitch
                        checked={props.allowFullscreen}
                        onChange={val => setProp(p => p.allowFullscreen = val)}
                        label="Allow Fullscreen"
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
