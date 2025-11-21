import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Page, CanvasItem } from '../types';

const STORAGE_KEY = '@ephemera_pages';

export function usePersistedPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load pages from storage on mount
  useEffect(() => {
    loadPages();
  }, []);

  // Save pages to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      savePages(pages);
    }
  }, [pages, isLoading]);

  const loadPages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedPages = JSON.parse(stored);
        setPages(loadedPages.length > 0 ? loadedPages : [createNewPage(0)]);
      } else {
        // Create first page if none exist
        setPages([createNewPage(0)]);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      setPages([createNewPage(0)]);
    } finally {
      setIsLoading(false);
    }
  };

  const savePages = async (pagesToSave: Page[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pagesToSave));
    } catch (error) {
      console.error('Error saving pages:', error);
    }
  };

  const createNewPage = (index: number): Page => ({
    id: `page_${Date.now()}_${index}`,
    title: `Page ${index + 1}`,
    backgroundStyle: 'dot-grid',
    items: [],
  });

  const addPage = useCallback(() => {
    const newPage = createNewPage(pages.length);
    setPages((prev) => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  }, [pages.length]);

  const deletePage = useCallback((pageIndex: number) => {
    if (pages.length === 1) {
      // Don't delete the last page, just clear it
      setPages([createNewPage(0)]);
      setCurrentPageIndex(0);
    } else {
      setPages((prev) => prev.filter((_, index) => index !== pageIndex));
      if (currentPageIndex >= pageIndex && currentPageIndex > 0) {
        setCurrentPageIndex(currentPageIndex - 1);
      }
    }
  }, [pages.length, currentPageIndex]);

  const addItemToCurrentPage = useCallback((newItem: CanvasItem) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        items: [...newPages[currentPageIndex].items, newItem],
      };
      return newPages;
    });
  }, [currentPageIndex]);

  const updateItemInCurrentPage = useCallback((id: string, updates: Partial<CanvasItem>) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        items: newPages[currentPageIndex].items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      };
      return newPages;
    });
  }, [currentPageIndex]);

  const deleteItemFromCurrentPage = useCallback((id: string) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        items: newPages[currentPageIndex].items.filter((item) => item.id !== id),
      };
      return newPages;
    });
  }, [currentPageIndex]);

  const bringToFrontInCurrentPage = useCallback((id: string) => {
    setPages((prev) => {
      const newPages = [...prev];
      const currentPage = newPages[currentPageIndex];
      const maxZIndex = Math.max(...currentPage.items.map((item) => item.zIndex), 0);
      newPages[currentPageIndex] = {
        ...currentPage,
        items: currentPage.items.map((item) =>
          item.id === id ? { ...item, zIndex: maxZIndex + 1 } : item
        ),
      };
      return newPages;
    });
  }, [currentPageIndex]);

  const clearCurrentPage = useCallback(() => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        items: [],
      };
      return newPages;
    });
  }, [currentPageIndex]);

  const currentPage = pages[currentPageIndex] || pages[0];

  return {
    pages,
    currentPage,
    currentPageIndex,
    isLoading,
    setCurrentPageIndex,
    addPage,
    deletePage,
    addItem: addItemToCurrentPage,
    updateItem: updateItemInCurrentPage,
    deleteItem: deleteItemFromCurrentPage,
    bringToFront: bringToFrontInCurrentPage,
    clearAll: clearCurrentPage,
  };
}
