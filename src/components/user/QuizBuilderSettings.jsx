import React from 'react';
import { useNode } from '@craftjs/core';
import { HelpCircle, Clock, Target, Eye, CornerUpLeft, Maximize, RotateCcw } from 'lucide-react';

export const QuizBuilderSettings = () => {
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
            {/* Quiz Section */}
            <div>
                <SectionHeader
                    title="Quiz Settings"
                    rightIcon={<IconButton icon={HelpCircle} size="sm" />}
                />

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
                        placeholder="Quiz title"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                        Description
                    </div>
                    <textarea
                        value={props.description || ''}
                        onChange={e => setProp(p => p.description = e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-md text-white text-xs resize-none"
                        rows={3}
                        placeholder="Quiz description"
                    />
                </div>

                {/* Time Limit */}
                <div className="mb-4">
                    <NumberInput
                        label="Time Limit"
                        value={props.timeLimit}
                        onChange={val => setProp(p => p.timeLimit = val)}
                        suffix="min"
                        min={1}
                        max={180}
                    />
                </div>

                {/* Passing Score */}
                <div className="mb-4">
                    <NumberInput
                        label="Passing Score"
                        value={props.passingScore}
                        onChange={val => setProp(p => p.passingScore = val)}
                        suffix="%"
                        min={1}
                        max={100}
                    />
                </div>
            </div>

            <Divider />

            {/* Options Section */}
            <div>
                <SectionHeader title="Options" />

                <div className="space-y-3">
                    <ToggleSwitch
                        checked={props.showResults}
                        onChange={val => setProp(p => p.showResults = val)}
                        label="Show Results"
                    />
                    <ToggleSwitch
                        checked={props.allowRetake}
                        onChange={val => setProp(p => p.allowRetake = val)}
                        label="Allow Retake"
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
                            min={500}
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

            <Divider />

            {/* Appearance Section */}
            <div>
                <SectionHeader
                    title="Appearance"
                    rightIcon={<IconButton icon={Eye} size="sm" />}
                />

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
            </div>

            <Divider />

            {/* Quiz Stats */}
            <div>
                <SectionHeader title="Statistics" />

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Questions</span>
                        <span className="text-white font-mono">{(props.questions || []).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Total Points</span>
                        <span className="text-white font-mono">
              {(props.questions || []).reduce((sum, q) => sum + (q.points || 0), 0)}
            </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Estimated Time</span>
                        <span className="text-white font-mono">{props.timeLimit} min</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
