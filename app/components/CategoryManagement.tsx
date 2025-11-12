'use client';

import { useState } from 'react';
import { useCategory } from '../contexts/CategoryContext';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Category } from '../types';

interface CategoryManagementProps {
  onCategoryChange?: () => void;
}

export default function CategoryManagement({ onCategoryChange }: CategoryManagementProps) {
  const { categories, addCategory, updateCategory, deleteCategory, refreshCategories } = useCategory();
  const { menuItems, refreshMenu } = useMenu();
  const { language } = useLanguage();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    nameInArabic: '',
  });

  const handleAddCategory = () => {
    setShowCategoryForm(true);
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      nameInArabic: '',
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
    setCategoryFormData({
      name: category.name,
      nameInArabic: category.nameInArabic || '',
    });
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmMessage = language === 'ar' 
      ? 'هل أنت متأكد أنك تريد حذف هذه الفئة؟'
      : 'Are you sure you want to delete this category?';
    
    if (!confirm(confirmMessage)) return;

    try {
      await deleteCategory(id);
      await refreshCategories();
      await refreshMenu();
      onCategoryChange?.();
    } catch (error: any) {
      console.error('Delete category error:', error);
      
      let errorMessage = error?.message || 'Failed to delete category. Please try again.';
      
      // Translate common error messages
      if (language === 'ar') {
        if (errorMessage.includes('Network error') || errorMessage.includes('connect')) {
          errorMessage = 'خطأ في الاتصال: لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.';
        } else if (errorMessage.includes('database') || errorMessage.includes('Database')) {
          errorMessage = 'خطأ في قاعدة البيانات. يرجى المحاولة مرة أخرى لاحقاً.';
        } else if (!errorMessage.includes('فشل')) {
          errorMessage = `فشل في حذف الفئة: ${errorMessage}`;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryFormData.name.trim()) {
      const errorMessage = language === 'ar'
        ? 'يرجى إدخال اسم الفئة'
        : 'Please enter a category name';
      alert(errorMessage);
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryFormData.name,
          nameInArabic: categoryFormData.nameInArabic || undefined,
        });
      } else {
        await addCategory({
          name: categoryFormData.name,
          nameInArabic: categoryFormData.nameInArabic || undefined,
        });
      }
      
      await refreshCategories();
      setCategoryFormData({
        name: '',
        nameInArabic: '',
      });
      setEditingCategory(null);
      setShowCategoryForm(false);
      onCategoryChange?.();
    } catch (error: any) {
      console.error('Category submit error:', error);
      
      // Extract error message
      let errorMessage = error?.message || 'Failed to save category. Please try again.';
      
      // Translate common error messages
      if (language === 'ar') {
        if (errorMessage.includes('already exists') || errorMessage.includes('already exists')) {
          errorMessage = 'فئة بهذا الاسم موجودة بالفعل';
        } else if (errorMessage.includes('Network error') || errorMessage.includes('connect')) {
          errorMessage = 'خطأ في الاتصال: لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.';
        } else if (errorMessage.includes('database') || errorMessage.includes('Database')) {
          errorMessage = 'خطأ في قاعدة البيانات. يرجى المحاولة مرة أخرى لاحقاً.';
        } else if (!errorMessage.includes('فشل')) {
          errorMessage = `فشل في حفظ الفئة: ${errorMessage}`;
        }
      }
      
      // Show error in alert (you can replace this with a toast notification later)
      alert(errorMessage);
    }
  };

  const cancelCategoryForm = () => {
    setCategoryFormData({
      name: '',
      nameInArabic: '',
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const getItemCount = (categoryId: string) => {
    return menuItems.filter(item => item.category.id === categoryId).length;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-8">
      <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {language === 'ar' ? 'إدارة الفئات' : 'Category Management'}
          </h2>
          <button
            onClick={handleAddCategory}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {language === 'ar' ? 'أضف فئة جديدة' : 'Add Category'}
          </button>
        </div>
      </div>

      {showCategoryForm && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ar' ? 'اسم الفئة (إنجليزي)' : 'Category Name (English)'}
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all"
                  placeholder={language === 'ar' ? 'مثال: Grill' : 'Example: Grill'}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ar' ? 'اسم الفئة (عربي)' : 'Category Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={categoryFormData.nameInArabic}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, nameInArabic: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all"
                  placeholder={language === 'ar' ? 'مثال: جريل' : 'Example: جريل'}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold"
              >
                {editingCategory 
                  ? (language === 'ar' ? 'تحديث الفئة' : 'Update Category') 
                  : (language === 'ar' ? 'أضف الفئة' : 'Add Category')
                }
              </button>
              <button
                type="button"
                onClick={cancelCategoryForm}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-semibold"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {language === 'ar' ? 'عدد العناصر' : 'Items Count'}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {language === 'ar' ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {language === 'ar' ? 'لا توجد فئات بعد. أضف الفئة الأولى!' : 'No categories yet. Add your first category!'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const itemCount = getItemCount(category.id);
                return (
                  <tr
                    key={category.id}
                    className="hover:bg-purple-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {category.nameInArabic || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {itemCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-200 font-semibold text-sm flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 font-semibold text-sm flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {language === 'ar' ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

