import React, { useState, useEffect } from 'react';
import { useHotkeys } from '../contexts/HotkeyContext';

export const HotkeySettingsModal = ({ isOpen, onClose }) => {
    const { hotkeys, setHotkeys } = useHotkeys();
    const [localHotkeys, setLocalHotkeys] = useState(hotkeys);
    const [editingKey, setEditingKey] = useState(null);

    useEffect(() => {
        if (isOpen) setLocalHotkeys(hotkeys);
    }, [isOpen]);

    const handleKeyCapture = (e) => {
        if (!editingKey) return;

        e.preventDefault();
        e.stopPropagation();

        const keys = [];
        if (e.ctrlKey || e.metaKey) keys.push('ctrl');
        if (e.shiftKey) keys.push('shift');
        if (e.altKey) keys.push('alt');

        const code = e.key.toLowerCase();
        if (!['shift', 'control', 'meta', 'alt'].includes(code)) {
            keys.push(code);
        }

        const hotkeyStr = keys.join('+');

        setLocalHotkeys(prev => ({
            ...prev,
            [editingKey]: hotkeyStr
        }));

        setEditingKey(null);
    };

    useEffect(() => {
        if (!editingKey) return;
        window.addEventListener('keydown', handleKeyCapture);
        return () => {
            window.removeEventListener('keydown', handleKeyCapture);
        };
    }, [editingKey]);

    const handleSave = () => {
        setHotkeys(localHotkeys);
        localStorage.setItem('customHotkeys', JSON.stringify(localHotkeys));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 text-white space-y-4">
                <h2 className="text-lg font-bold">Customize Hotkeys</h2>

                {Object.entries(localHotkeys).map(([action, value]) => (
                    <div key={action} className="flex justify-between items-center">
                        <span className="capitalize">{action}</span>
                        <button
                            onClick={() => setEditingKey(action)}
                            className={`px-2 py-1 rounded text-sm w-40 text-right ${
                                editingKey === action ? 'bg-blue-700' : 'bg-gray-700'
                            }`}
                        >
                            {editingKey === action ? 'Press keys...' : value}
                        </button>
                    </div>
                ))}

                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-1 bg-gray-600 rounded hover:bg-gray-500">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-500">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
