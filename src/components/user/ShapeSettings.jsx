import React from 'react';
import { useNode } from '@craftjs/core';
import {
    Circle, Square, RectangleHorizontal, EllipsisIcon, Triangle
} from 'lucide-react';

export const ShapeSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

    const shapes = [
        { value: 'circle', icon: Circle, label: 'Circle' },
        { value: 'square', icon: Square, label: 'Square' },
        { value: 'rectangle', icon: RectangleHorizontal, label: 'Rectangle' },
        { value: 'ellipse', icon: EllipsisIcon, label: 'Ellipse' },
        { value: 'triangle', icon: Triangle, label: 'Triangle' },
    ];

    const NumberInput = ({ label, value, onChange }) => (
        <div className="flex items-center justify-between text-xs text-white mb-2">
            <span>{label}</span>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="bg-gray-700 text-white text-xs px-2 py-1 rounded w-24 text-right"
            />
        </div>
    );

    return (
        <div className="p-4 bg-gray-900 border-l border-gray-700 space-y-4 text-sm text-white">
            {/* Тип фигуры — кнопки */}
            <div>
                <label className="block mb-1 text-xs text-gray-400">Shape Type</label>
                <div className="grid grid-cols-5 gap-2">
                    {shapes.map(({ value, icon: Icon, label }) => (
                        <button
                            key={value}
                            onClick={() => setProp(p => p.type = value)}
                            title={label}
                            className={`flex items-center justify-center p-2 rounded border text-white transition 
                ${props.type === value
                                ? 'bg-blue-500 border-blue-400 shadow-md'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}
              `}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Цвет */}
            <div>
                <label className="block mb-1 text-xs text-gray-400">Color</label>
                <input
                    type="color"
                    value={props.backgroundColor}
                    onChange={(e) => setProp(p => p.backgroundColor = e.target.value)}
                    className="w-full h-10 border-none rounded cursor-pointer bg-transparent"
                />
            </div>

            {/* Размеры */}
            <NumberInput
                label="Width"
                value={props.width}
                onChange={(val) => setProp(p => p.width = val)}
            />
            <NumberInput
                label="Height"
                value={props.height}
                onChange={(val) => setProp(p => p.height = val)}
            />

            {/* Border Radius — только для прямоугольника */}
            {props.type === 'rectangle' && (
                <NumberInput
                    label="Border Radius"
                    value={props.borderRadius}
                    onChange={(val) => setProp(p => p.borderRadius = val)}
                />
            )}
        </div>
    );
};
