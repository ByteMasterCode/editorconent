import React, { createContext, useContext, useState } from 'react';

const PagesContext = createContext(undefined);

export const usePagesContext = () => {
    const context = useContext(PagesContext);
    if (!context) {
        throw new Error('usePagesContext must be used within a PagesProvider');
    }
    return context;
};

export const PagesProvider = ({ children }) => {
    const [pages, setPages] = useState([
        {
            id: 'page-1',
            title: 'Introduction',
            content:
                '{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#ffffff","padding":[40,40,40,40],"minHeight":600},"displayName":"Container","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);

    const [currentPageId, setCurrentPageId] = useState('page-1');

    const currentPageIndex = pages.findIndex((page) => page.id === currentPageId);
    const canGoNext = currentPageIndex < pages.length - 1;
    const canGoPrev = currentPageIndex > 0;

    const addPage = (title) => {
        const newPage = {
            id: `page-${Date.now()}`,
            title: title || `Page ${pages.length + 1}`,
            content:
                '{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#ffffff","padding":[40,40,40,40],"minHeight":600},"displayName":"Container","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setPages((prev) => [...prev, newPage]);
        setCurrentPageId(newPage.id);
    };

    const deletePage = (id) => {
        if (pages.length <= 1) return;

        setPages((prev) => prev.filter((page) => page.id !== id));

        if (currentPageId === id) {
            const pageIndex = pages.findIndex((page) => page.id === id);
            const nextPage = pages[pageIndex + 1] || pages[pageIndex - 1];
            if (nextPage) setCurrentPageId(nextPage.id);
        }
    };

    const updatePage = (id, updates) => {
        setPages((prev) =>
            prev.map((page) =>
                page.id === id
                    ? { ...page, ...updates, updatedAt: new Date() }
                    : page
            )
        );
    };

    const setCurrentPage = (id) => {
        setCurrentPageId(id);
    };

    const duplicatePage = (id) => {
        const pageToClone = pages.find((page) => page.id === id);
        if (!pageToClone) return;

        const newPage = {
            ...pageToClone,
            id: `page-${Date.now()}`,
            title: `${pageToClone.title} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setPages((prev) => [...prev, newPage]);
        setCurrentPageId(newPage.id);
    };

    const reorderPages = (fromIndex, toIndex) => {
        setPages((prev) => {
            const newPages = [...prev];
            const [removed] = newPages.splice(fromIndex, 1);
            newPages.splice(toIndex, 0, removed);
            return newPages;
        });
    };

    const nextPage = () => {
        if (canGoNext) {
            const nextPageId = pages[currentPageIndex + 1].id;
            setCurrentPageId(nextPageId);
        }
    };

    const prevPage = () => {
        if (canGoPrev) {
            const prevPageId = pages[currentPageIndex - 1].id;
            setCurrentPageId(prevPageId);
        }
    };

    return (
        <PagesContext.Provider
            value={{
                pages,
                currentPageId,
                currentPageIndex,
                addPage,
                deletePage,
                updatePage,
                setCurrentPage,
                duplicatePage,
                reorderPages,
                nextPage,
                prevPage,
                canGoNext,
                canGoPrev
            }}
        >
            {children}
        </PagesContext.Provider>
    );
};
