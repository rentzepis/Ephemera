import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CanvasItem } from '../types';

const STORAGE_KEY = '@ephemera_items';

export function usePersistedItems() {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from storage on mount
  useEffect(() => {
    loadItems();
  }, []);

  // Save items to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveItems(items);
    }
  }, [items, isLoading]);

  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveItems = async (itemsToSave: CanvasItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const addItem = useCallback((newItem: CanvasItem) => {
    setItems((prev) => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CanvasItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setItems((prev) => {
      const maxZIndex = Math.max(...prev.map((item) => item.zIndex), 0);
      return prev.map((item) =>
        item.id === id ? { ...item, zIndex: maxZIndex + 1 } : item
      );
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    bringToFront,
    clearAll,
  };
}
