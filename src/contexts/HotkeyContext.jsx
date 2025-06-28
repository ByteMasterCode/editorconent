// src/contexts/HotkeyContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const DEFAULT_HOTKEYS = {
    delete: 'Backspace',
    undo: 'ctrl+z',
    redo: 'ctrl+shift+z',
};

const HotkeyContext = createContext();

export const useHotkeys = () => useContext(HotkeyContext);

export const HotkeyProvider = ({ children }) => {
    const [hotkeys, setHotkeys] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('customHotkeys')) || DEFAULT_HOTKEYS;
        } catch {
            return DEFAULT_HOTKEYS;
        }
    });

    useEffect(() => {
        localStorage.setItem('customHotkeys', JSON.stringify(hotkeys));
    }, [hotkeys]);

    return (
        <HotkeyContext.Provider value={{ hotkeys, setHotkeys }}>
            {children}
        </HotkeyContext.Provider>
    );
};
