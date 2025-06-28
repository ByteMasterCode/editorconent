// src/components/HotkeyManager.jsx
import React, { useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { useHotkeys } from '../contexts/HotkeyContext';

export const HotkeyManager = () => {
    const { hotkeys } = useHotkeys();
    const { actions, query } = useEditor();

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            const isCtrl = e.ctrlKey || e.metaKey;

            // Удаление компонента
            if (key === hotkeys.delete.toLowerCase()) {
                const selected = query.getEvent('selected').last();
                if (selected && query.node(selected).isDeletable()) {
                    e.preventDefault();
                    actions.delete(selected);
                }
            }

            // Undo (Ctrl+Z)
            if (hotkeys.undo === 'ctrl+z' && isCtrl && !e.shiftKey && key === 'z') {
                e.preventDefault();
                actions.history.undo();
            }

            // Redo (Ctrl+Shift+Z)
            if (hotkeys.redo === 'ctrl+shift+z' && isCtrl && e.shiftKey && key === 'z') {
                e.preventDefault();
                actions.history.redo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [hotkeys, actions, query]);

    return null;
};
