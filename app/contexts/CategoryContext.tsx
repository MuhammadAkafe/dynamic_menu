'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '../types';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  isLoading: boolean;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      console.log('Attempting to add category:', category);
      
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      console.log('Response status:', response.status, response.statusText);

      if (response.ok) {
        const newCategory = await response.json();
        console.log('Category created successfully:', newCategory);
        setCategories((prev) => [...prev, newCategory]);
      } else {
        // Try to parse error response
        let errorMessage = 'Failed to add category';
        let errorCode = null;
        
        try {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          errorMessage = errorData.error || errorMessage;
          errorCode = errorData.errorCode;
        } catch (parseError) {
          // If response is not JSON, use status text
          console.error('Failed to parse error response:', parseError);
          errorMessage = response.statusText || `Server error (${response.status})`;
        }
        
        // Include error code in message if available
        if (errorCode) {
          errorMessage = `${errorMessage} (Error Code: ${errorCode})`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error adding category:', error);
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error?.message);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
      
      // Re-throw with original message if it's already an Error
      if (error instanceof Error) {
        throw error;
      }
      
      // Fallback for unknown errors
      throw new Error(error?.message || 'An unexpected error occurred while adding the category');
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? updatedCategory : c))
        );
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        isLoading,
        refreshCategories: fetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}

