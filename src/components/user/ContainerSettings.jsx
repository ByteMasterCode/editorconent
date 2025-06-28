import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
    MoveHorizontal,
    MoveVertical,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    Move,
    RotateCcw,
    FlipHorizontal,
    FlipVertical,
    Maximize,
    Eye,
    EyeOff,
    Droplet,
    CornerUpLeft,
    Plus,
    Minus,
    Lock,
    Unlock,
    Grid3X3,
    Square,
    Circle,
    Triangle,
    Palette,
    Image as ImageIcon,
    BadgeCent as Gradient
} from 'lucide-react';

export const ContainerSettings = () => {
    const {
        actions: { setProp },
        props
    } = useNode(node => ({
        props: node.data.props
    }));

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [lockAspectRatio, setLockAspectRatio] = useState(false);

    const NumberInput = ({ label, value, onChange, suffix = '', min = 0, max = 9999 }) => (
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{label}</span>
            <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 min-w-[65px] border border-gray-600/50">
                <input
                    type="number"
                    value={value || 0}
                    min={min}
                    max={max}
                    onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
                    className="bg-transparent text-white text-xs w-full text-right outline-none font-mono"
                />
                {suffix && <span className="text-gray-400 text-[10px] ml-1 font-medium">{suffix}</span>}
            </div>
        </div>
    );

    const IconButton = ({ icon: Icon, active = false, onClick, size = "sm", disabled = false }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${size === "sm" ? "p-1.5 w-7 h-7" : "p-2 w-8 h-8"} 
        rounded-md transition-all duration-200 flex items-center justify-center
        ${active
                ? 'bg-blue-500 text-white shadow-md'
                : disabled
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
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
                    value={props.background || '#ffffff'}
                    onChange={e => setProp(p => p.background = e.target.value)}
                    className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-xs font-mono">{props.background || '#ffffff'}</span>
                </div>
            </div>
            <div className="grid grid-cols-8 gap-1">
                {[
                    '#ffffff','#f3f4f6','#d1d5db','#6b7280','#374151','#111827','#000000','#ef4444',
                    '#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#10b981','#06b6d4','#0ea5e9',
                    '#3b82f6','#6366f1','#8b5cf6','#a855f7','#d946ef','#ec4899'
                ].map(color => (
                    <button
                        key={color}
                        onClick={() => setProp(p => p.background = color)}
                        className="w-6 h-6 rounded border border-gray-600/50 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-850 text-white p-4 space-y-4 text-sm border-l border-gray-700/50">
            {/* Position Section */}
            <div>
                <SectionHeader title="Position" />

                {/* Alignment Controls */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Alignment</div>
                    <div className="flex gap-1 mb-3">
                        <IconButton
                            icon={AlignLeft}
                            active={props.textAlign === 'left'}
                            onClick={() => setProp(p => p.textAlign = 'left')}
                        />
                        <IconButton
                            icon={AlignCenter}
                            active={props.textAlign === 'center'}
                            onClick={() => setProp(p => p.textAlign = 'center')}
                        />
                        <IconButton
                            icon={AlignRight}
                            active={props.textAlign === 'right'}
                            onClick={() => setProp(p => p.textAlign = 'right')}
                        />
                        <div className="w-px bg-gray-600 mx-1.5"></div>
                        <IconButton
                            icon={AlignStartVertical}
                            active={props.alignItems === 'flex-start'}
                            onClick={() => setProp(p => p.alignItems = 'flex-start')}
                        />
                        <IconButton
                            icon={AlignCenterVertical}
                            active={props.alignItems === 'center'}
                            onClick={() => setProp(p => p.alignItems = 'center')}
                        />
                        <IconButton
                            icon={AlignEndVertical}
                            active={props.alignItems === 'flex-end'}
                            onClick={() => setProp(p => p.alignItems = 'flex-end')}
                        />
                    </div>
                </div>

                {/* Position Values */}
                <div className="space-y-2.5 mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Position</div>
                    <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                            label="X"
                            value={props.x || 0}
                            onChange={val => setProp(p => p.x = val)}
                            min={-9999}
                        />
                        <NumberInput
                            label="Y"
                            value={props.y || 0}
                            onChange={val => setProp(p => p.y = val)}
                            min={-9999}
                        />
                    </div>
                </div>

                {/* Rotation & Transform */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Rotation</div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 flex-1 border border-gray-600/50">
                            <RotateCcw className="w-3.5 h-3.5 text-gray-400 mr-2" />
                            <input
                                type="number"
                                value={props.rotation || 0}
                                onChange={e => setProp(p => p.rotation = parseInt(e.target.value, 10) || 0)}
                                className="bg-transparent text-white text-xs w-full outline-none font-mono"
                                min={-360}
                                max={360}
                            />
                            <span className="text-gray-400 text-[10px] ml-1 font-medium">°</span>
                        </div>
                        <IconButton icon={FlipHorizontal} />
                        <IconButton icon={FlipVertical} />
                        <IconButton icon={Move} />
                    </div>
                </div>
            </div>

            <Divider />

            {/* Layout Section */}
            <div>
                <SectionHeader title="Layout" />

                {/* Flex Direction */}
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Direction</div>
                    <div className="flex gap-1">
                        <IconButton
                            icon={MoveHorizontal}
                            active={props.flexDirection === 'row'}
                            onClick={() => setProp(p => p.flexDirection = 'row')}
                        />
                        <IconButton
                            icon={MoveVertical}
                            active={props.flexDirection === 'column'}
                            onClick={() => setProp(p => p.flexDirection = 'column')}
                        />
                        <IconButton
                            icon={Grid3X3}
                            active={props.display === 'grid'}
                            onClick={() => setProp(p => p.display = 'grid')}
                        />
                    </div>
                </div>

                {/* Dimensions */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Dimensions</span>
                        <IconButton
                            icon={lockAspectRatio ? Lock : Unlock}
                            size="sm"
                            active={lockAspectRatio}
                            onClick={() => setLockAspectRatio(!lockAspectRatio)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                            label="W"
                            value={props.width || 100}
                            onChange={val => {
                                setProp(p => p.width = val);
                                if (lockAspectRatio && props.height) {
                                    const ratio = val / (props.width || 100);
                                    setProp(p => p.height = Math.round((props.height || 100) * ratio));
                                }
                            }}
                            suffix="px"
                        />
                        <NumberInput
                            label="H"
                            value={props.height || 100}
                            onChange={val => {
                                setProp(p => p.height = val);
                                if (lockAspectRatio && props.width) {
                                    const ratio = val / (props.height || 100);
                                    setProp(p => p.width = Math.round((props.width || 100) * ratio));
                                }
                            }}
                            suffix="px"
                        />
                    </div>
                    <div className="flex justify-end mt-2">
                        <IconButton icon={Maximize} size="sm" />
                    </div>
                </div>

                {/* Gap & Padding */}
                <div className="space-y-2.5">
                    <NumberInput
                        label="Gap"
                        value={props.gap || 0}
                        onChange={val => setProp(p => p.gap = val)}
                        suffix="px"
                    />
                    <NumberInput
                        label="Padding"
                        value={props.padding?.[0] || 0}
                        onChange={val => setProp(p => p.padding = [val, val, val, val])}
                        suffix="px"
                    />
                </div>
            </div>

            <Divider />

            {/* Appearance Section */}
            <div>
                <SectionHeader
                    title="Appearance"
                    rightIcon={(
                        <>
                            <IconButton
                                icon={props.visible !== false ? Eye : EyeOff}
                                size="sm"
                                active={props.visible !== false}
                                onClick={() => setProp(p => p.visible = !p.visible)}
                            />
                            <IconButton icon={Droplet} size="sm" />
                        </>
                    )}
                />

                {/* Opacity */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Opacity</span>
                        <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 border border-gray-600/50">
                            <Eye className="w-3.5 h-3.5 text-gray-400 mr-2" />
                            <input
                                type="number"
                                value={Math.round((props.opacity || 1) * 100)}
                                onChange={e => setProp(p => p.opacity = (parseInt(e.target.value, 10) || 100) / 100)}
                                className="bg-transparent text-white text-xs w-8 text-right outline-none font-mono"
                                min={0}
                                max={100}
                            />
                            <span className="text-gray-400 text-[10px] ml-1 font-medium">%</span>
                        </div>
                    </div>
                </div>

                {/* Border Radius */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Corner radius</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-700/80 rounded-md px-2 py-1.5 border border-gray-600/50">
                                <CornerUpLeft className="w-3.5 h-3.5 text-gray-400 mr-2" />
                                <input
                                    type="number"
                                    value={props.borderRadius || 0}
                                    onChange={e => setProp(p => p.borderRadius = parseInt(e.target.value, 10) || 0)}
                                    className="bg-transparent text-white text-xs w-8 text-right outline-none font-mono"
                                    min={0}
                                    max={100}
                                />
                                <span className="text-gray-400 text-[10px] ml-1 font-medium">px</span>
                            </div>
                            <IconButton icon={CornerUpLeft} size="sm" />
                        </div>
                    </div>
                </div>

                {/* Shadow */}
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Shadow</span>
                        <div className="flex gap-1">
                            <IconButton
                                icon={Square}
                                size="sm"
                                active={props.boxShadow}
                                onClick={() => setProp(p => p.boxShadow = p.boxShadow ? null : '0 4px 6px -1px rgba(0, 0, 0, 0.1)')}
                            />
                            <IconButton icon={Plus} size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            <Divider />

            {/* Fill Section */}
            <div>
                <SectionHeader
                    title="Fill"
                    rightIcon={(
                        <>
                            <div className="grid grid-cols-2 gap-px w-4 h-4 mr-1">
                                <div className="bg-gray-500 rounded-sm"></div>
                                <div className="bg-gray-600 rounded-sm"></div>
                                <div className="bg-gray-600 rounded-sm"></div>
                                <div className="bg-gray-500 rounded-sm"></div>
                            </div>
                            <IconButton icon={Plus} size="sm" />
                        </>
                    )}
                />

                {/* Fill Type */}
                <div className="mb-3">
                    <div className="flex gap-1 mb-3">
                        <IconButton
                            icon={Palette}
                            active={!props.backgroundImage}
                            onClick={() => setProp(p => p.backgroundImage = null)}
                        />
                        <IconButton
                            icon={Gradient}
                            active={props.backgroundImage?.includes('gradient')}
                            onClick={() => setProp(p => p.backgroundImage = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)')}
                        />
                        <IconButton
                            icon={ImageIcon}
                            active={props.backgroundImage && !props.backgroundImage.includes('gradient')}
                            onClick={() => setProp(p => p.backgroundImage = 'url(https://images.unsplash.com/photo-1557683316-973673baf926)')}
                        />
                    </div>
                </div>

                {/* Color Fill */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ColorPreview
                            color={props.background || '#ffffff'}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        />
                        <span className="text-xs text-white font-medium">Solid</span>
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

                {/* Color Picker */}
                {showColorPicker && <CustomColorPicker />}
            </div>
        </div>
    );
};
