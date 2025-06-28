import { useState, useEffect, useCallback } from 'react';
import { useEditor } from '@craftjs/core';

export const useComponentSelection = () => {
    const { selected, actions, query } = useEditor((state, query) => {
        const currentNodeId = query.getEvent('selected').last();
        return {
            selected: currentNodeId
        };
    });

    const [selectionState, setSelectionState] = useState({
        selectedId: null,
        selectedComponent: null,
        isSelectionPersistent: false
    });

    // Обновление состояния при изменении выделения
    useEffect(() => {
        if (selected && selected !== selectionState.selectedId) {
            const node = query.node(selected).get();
            setSelectionState({
                selectedId: selected,
                selectedComponent: node,
                isSelectionPersistent: true
            });
        }
    }, [selected, query, selectionState.selectedId]);

    // Выделить компонент
    const selectComponent = useCallback((componentId) => {
        actions.selectNode(componentId);
        const node = query.node(componentId).get();

        setSelectionState({
            selectedId: componentId,
            selectedComponent: node,
            isSelectionPersistent: true
        });
    }, [actions, query]);

    // Очистить выделение
    const clearSelection = useCallback(() => {
        actions.selectNode('');
        setSelectionState({
            selectedId: null,
            selectedComponent: null,
            isSelectionPersistent: false
        });
    }, [actions]);

    // Получить свойства компонента
    const getComponentProperties = useCallback((componentId) => {
        const id = componentId || selectionState.selectedId;
        if (!id) return null;

        try {
            const node = query.node(id).get();
            return {
                id,
                name: node.data.displayName || node.data.type?.resolvedName || 'Component',
                type: node.data.type?.resolvedName || 'Unknown',
                props: node.data.props || {},
                custom: node.data.custom || {},
                hidden: node.data.hidden || false,
                locked: node.data.locked || false
            };
        } catch (error) {
            console.error('Error getting component properties:', error);
            return null;
        }
    }, [query, selectionState.selectedId]);

    // Проверка, выбран ли компонент
    const isComponentSelected = useCallback((componentId) => {
        return selectionState.selectedId === componentId && selectionState.isSelectionPersistent;
    }, [selectionState]);

    return {
        selectedId: selectionState.selectedId,
        selectedComponent: selectionState.selectedComponent,
        isSelectionPersistent: selectionState.isSelectionPersistent,
        selectComponent,
        clearSelection,
        getComponentProperties,
        isComponentSelected
    };
};
