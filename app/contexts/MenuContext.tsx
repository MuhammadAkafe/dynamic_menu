'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Category } from '../types';

interface MenuContextType {
  menuItems: MenuItem[];
  addItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemsByCategory: (category: Category) => MenuItem[];
  isLoading: boolean;
  refreshMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
       else {
        console.error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);
  

  const addItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const newItem = await response.json();
        setMenuItems((prev) => [...prev, newItem]);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, item: Partial<MenuItem>) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setMenuItems((prev) =>
          prev.map((i) => (i.id === id ? updatedItem : i))
        );
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update menu item');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenuItems((prev) => prev.filter((i) => i.id !== id));
      }
       else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const getItemsByCategory = (category: Category): MenuItem[] => {
    return menuItems.filter((item) => item.category.id === category.id && item.category.name === category.name);
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addItem,
        updateItem,
        deleteItem,
        getItemsByCategory,
        isLoading,
        refreshMenu: fetchMenuItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

