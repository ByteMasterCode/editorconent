// src/components/HotkeySettings.jsx
import React from 'react';
import { useHotkeys } from '../contexts/HotkeyContext';

export const HotkeySettings = () => {
    const { hotkeys, setHotkeys } = useHotkeys();

    const handleChange = (action, value) => {
        setHotkeys((prev) => ({ ...prev, [action]: value }));
    };

    return (
        <div className="space-y-4 p-4 bg-gray-900 border-t border-gray-700 text-white">
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
            {Object.entries(hotkeys).map(([action, value]) => (
                <div key={action} className="flex items-center gap-4">
                    <label className="w-24 capitalize">{action}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(action, e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded w-40"
                    />
                </div>
            ))}
        </div>
    );
};
