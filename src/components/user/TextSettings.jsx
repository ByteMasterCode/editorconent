// TextSettings.jsx
import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';

export const TextSettings = () => {
    const { actions: { setProp }, props } = useNode(node => ({
        props: node.data.props
    }));

    const fontFamilies = [
        'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
        'Roboto', 'Open Sans', 'Montserrat'
    ];

    const NumberInput = ({ label, value, onChange, suffix = '', min = 0, max = 9999 }) => (
        <div className="flex items-center justify-between py-1">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">{label}</span>
            <div className="flex items-center bg-gray-700/60 rounded-sm px-1.5 py-1 min-w-[65px] border border-gray-600/40 focus-within:border-blue-500 transition-colors">
                <input
                    type="number"
                    value={value != null ? value : ''}
                    min={min}
                    max={max}
                    onChange={e => onChange(parseFloat(e.target.value) || 0)}
                    className="bg-transparent text-white text-xs w-full text-right outline-none font-mono placeholder-gray-500"
                    placeholder="0"
                />
                {suffix && (
                    <span className="text-gray-400 text-[9px] ml-1 font-medium">{suffix}</span>
                )}
            </div>
        </div>
    );

    const IconButton = ({ icon: Icon, active, onClick, title }) => (
        <button
            onClick={onClick}
            title={title}
            className={`
                p-1.5 w-7 h-7 rounded-sm transition-all duration-200 flex items-center justify-center border border-transparent
                ${active
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/70 hover:text-white border-gray-600/40'}
            `}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    const SectionHeader = ({ title }) => (
        <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
            {title}
        </h4>
    );

    const Divider = () => <div className="border-t border-gray-700/50 my-4" />;

    return (
        <div className=" p-3 text-white text-sm font-sans border-l border-gray-700">

            <div className="pb-4">
                <SectionHeader title="Layout" />
                <div className="space-y-2">
                    <NumberInput
                        label="Width"
                        value={props.width}
                        onChange={val => setProp(p => (p.width = val))}
                        suffix="px"
                        min={50}
                        max={2000}
                    />
                    <NumberInput
                        label="Height"
                        value={props.height}
                        onChange={val => setProp(p => (p.height = val))}
                        suffix="px"
                        min={20}
                        max={2000}
                    />
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3">
                    <NumberInput
                        label="Margin T"
                        value={props.margin?.[0]}
                        onChange={val => setProp(p => (p.margin = [val, p.margin?.[1], p.margin?.[2], p.margin?.[3]]))}
                        suffix="px"
                    />
                    <NumberInput
                        label="Margin R"
                        value={props.margin?.[1]}
                        onChange={val => setProp(p => (p.margin = [p.margin?.[0], val, p.margin?.[2], p.margin?.[3]]))}
                        suffix="px"
                    />
                    <NumberInput
                        label="Margin B"
                        value={props.margin?.[2]}
                        onChange={val => setProp(p => (p.margin = [p.margin?.[0], p.margin?.[1], val, p.margin?.[3]]))}
                        suffix="px"
                    />
                    <NumberInput
                        label="Margin L"
                        value={props.margin?.[3]}
                        onChange={val => setProp(p => (p.margin = [p.margin?.[0], p.margin?.[1], p.margin?.[2], val]))}
                        suffix="px"
                    />
                </div>
            </div>

            <Divider />

            <div className="space-y-2 pb-4">
                <SectionHeader title="Spacing" />
                <NumberInput
                    label="Line Height"
                    value={props.lineHeight}
                    onChange={val => setProp(p => (p.lineHeight = val))}
                    min={0.5}
                    max={4}
                />
                <NumberInput
                    label="Letter Spacing"
                    value={props.letterSpacing}
                    onChange={val => setProp(p => (p.letterSpacing = val))}
                    suffix="px"
                    min={-5}
                    max={20}
                />
                <NumberInput
                    label="Paragraph Spacing"
                    value={props.paragraphSpacing}
                    onChange={val => setProp(p => (p.paragraphSpacing = val))}
                    suffix="px"
                    min={0}
                    max={50}
                />
            </div>

            <Divider />

            <div className="space-y-2 pb-4">
                <SectionHeader title="Content" />
                <textarea
                    value={props.text}
                    onChange={e => setProp(p => (p.text = e.target.value))}
                    rows={3}
                    className="w-full bg-gray-700/60 rounded-sm p-2 text-xs text-white focus:outline-none border border-gray-600/40 focus:border-blue-500 transition-colors"
                />
            </div>

            <Divider />

            <div className="space-y-2 pb-4">
                <SectionHeader title="Font" />
                <div className="flex items-center justify-between py-1">
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Family</span>
                    <select
                        value={props.fontFamily}
                        onChange={e => setProp(p => (p.fontFamily = e.target.value))}
                        className="bg-gray-700/60 text-white text-xs rounded-sm p-1.5 focus:outline-none border border-gray-600/40 focus:border-blue-500 transition-colors"
                    >
                        {fontFamilies.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
                <NumberInput
                    label="Size"
                    value={props.fontSize}
                    onChange={val => setProp(p => (p.fontSize = val))}
                    suffix="px"
                    min={6}
                    max={200}
                />
            </div>

            <Divider />

            <div className="space-y-2 pb-4">
                <SectionHeader title="Style" />
                <div className="flex items-center gap-2">
                    <IconButton
                        icon={Bold}
                        active={props.fontWeight === 'bold'}
                        onClick={() =>
                            setProp(p => (p.fontWeight = p.fontWeight === 'bold' ? 'normal' : 'bold'))
                        }
                        title="Bold"
                    />
                    <IconButton
                        icon={Italic}
                        active={props.fontStyle === 'italic'}
                        onClick={() =>
                            setProp(p => (p.fontStyle = p.fontStyle === 'italic' ? 'normal' : 'italic'))
                        }
                        title="Italic"
                    />
                    <IconButton
                        icon={Underline}
                        active={props.textDecoration === 'underline'}
                        onClick={() =>
                            setProp(p => (p.textDecoration = p.textDecoration === 'underline' ? 'none' : 'underline'))
                        }
                        title="Underline"
                    />
                    <IconButton
                        icon={Strikethrough}
                        active={props.textDecoration === 'line-through'}
                        onClick={() =>
                            setProp(p => (p.textDecoration = p.textDecoration === 'line-through' ? 'none' : 'line-through'))
                        }
                        title="Strikethrough"
                    />
                </div>
            </div>

            <Divider />

            <div className="space-y-2 pb-4">
                <SectionHeader title="Alignment" />
                <div className="flex items-center gap-2">
                    <IconButton
                        icon={AlignLeft}
                        active={props.textAlign === 'left'}
                        onClick={() => setProp(p => (p.textAlign = 'left'))}
                        title="Align Left"
                    />
                    <IconButton
                        icon={AlignCenter}
                        active={props.textAlign === 'center'}
                        onClick={() => setProp(p => (p.textAlign = 'center'))}
                        title="Align Center"
                    />
                    <IconButton
                        icon={AlignRight}
                        active={props.textAlign === 'right'}
                        onClick={() => setProp(p => (p.textAlign = 'right'))}
                        title="Align Right"
                    />
                    <IconButton
                        icon={AlignJustify}
                        active={props.textAlign === 'justify'}
                        onClick={() => setProp(p => (p.textAlign = 'justify'))}
                        title="Justify"
                    />
                </div>
            </div>

            <Divider />

            <div className="space-y-2 pb-1">
                <SectionHeader title="Color" />
                <div className="flex items-center gap-2">
                    <label htmlFor="textColor" className="text-xs text-gray-300 w-full">Text Color</label>
                    <input
                        type="color"
                        id="textColor"
                        value={props.color || '#000000'}
                        onChange={e => setProp(p => (p.color = e.target.value))}
                        className="w-10 h-6 p-0 border border-gray-600/50 rounded-sm bg-transparent cursor-pointer overflow-hidden appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                        title="Text Color"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="bgColor" className="text-xs text-gray-300 w-full">Background</label>
                    <input
                        type="color"
                        id="bgColor"
                        value={props.backgroundColor || '#ffffff'}
                        onChange={e => setProp(p => (p.backgroundColor = e.target.value))}
                        className="w-10 h-6 p-0 border border-gray-600/50 rounded-sm bg-transparent cursor-pointer overflow-hidden appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                        title="Background Color"
                    />
                </div>
            </div>
        </div>
    );
};