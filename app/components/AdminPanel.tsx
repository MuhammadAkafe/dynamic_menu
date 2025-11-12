'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import { useCategory } from '../contexts/CategoryContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuItem } from '../types';
import { useRouter } from 'next/navigation';
import AddAndEdit from './AddAndEdit';
import CategoryManagement from './CategoryManagement';

const getCategoryBadgeColors = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('grill') || name.includes('جريل')) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
  } else if (name.includes('salad') || name.includes('سلط')) {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  } else if (name.includes('drink') || name.includes('مشروب')) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  }
  return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
};

export default function AdminPanel() {
  const { logout } = useAuth();
  const { menuItems, addItem, updateItem, deleteItem } = useMenu();
  const { categories } = useCategory();
  const { language } = useLanguage();
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingItem(null);
    setShowAddForm(!showAddForm);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      imageUrl: '',
    });
  };

  const handleCategoryChange = () => {
    // Update form categoryId if it's empty or invalid
    if (categories.length > 0) {
      const currentCategoryExists = categories.some(cat => cat.id === formData.categoryId);
      if (!currentCategoryExists) {
        setFormData(prev => ({
          ...prev,
          categoryId: categories[0].id,
        }));
      }
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowAddForm(false);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.category.id,
      imageUrl: item.imageUrl || '',
    });
  };

  const handleDelete = async (id: string) => {
    const confirmMessage = language === 'ar' 
      ? 'هل أنت متأكد أنك تريد حذف هذا العنصر؟'
      : 'Are you sure you want to delete this item?';
    if (confirm(confirmMessage)) {
      try {
        await deleteItem(id);
      } catch {
        const errorMessage = language === 'ar'
          ? 'فشل في حذف العنصر. يرجى المحاولة مرة أخرى.'
          : 'Failed to delete item. Please try again.';
        alert(errorMessage);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      const errorMessage = language === 'ar'
        ? 'يرجى إدخال سعر صحيح'
        : 'Please enter a valid price';
      alert(errorMessage);
      return;
    }

    try {
      const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
      if (!selectedCategory) {
        const errorMessage = language === 'ar'
          ? 'يرجى اختيار فئة صحيحة'
          : 'Please select a valid category';
        alert(errorMessage);
        return;
      }

      if (editingItem) {
        await updateItem(editingItem.id, {
          name: formData.name,
          description: formData.description,
          price: price,
          category: selectedCategory,
          imageUrl: formData.imageUrl || undefined,
        });
      } else {
        await addItem({
          name: formData.name,
          description: formData.description,
          price: price,
          category: selectedCategory,
          imageUrl: formData.imageUrl || undefined,
        });
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        imageUrl: '',
      });
      setEditingItem(null);
      setShowAddForm(false);
    } catch {
      const errorMessage = language === 'ar'
        ? 'فشل في حفظ العنصر. يرجى المحاولة مرة أخرى.'
        : 'Failed to save item. Please try again.';
      alert(errorMessage);
    }
  };

  const cancelForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      imageUrl: '',
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'أدر قائمة مطعمك' : 'Manage your restaurant menu'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {language === 'ar' ? 'عرض القائمة' : 'View Menu'}
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </div>

        <CategoryManagement onCategoryChange={handleCategoryChange} />

        <AddAndEdit handleAdd={handleAdd} showAddForm={showAddForm} 
        editingItem={editingItem} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} cancelForm={cancelForm} />

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {language === 'ar' ? 'جميع عناصر القائمة' : 'All Menu Items'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'ar' ? 'الفئة' : 'Category'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'ar' ? 'السعر' : 'Price'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {menuItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          {language === 'ar' ? 'لا توجد عناصر قائمة بعد. أضف العنصر الأول!' : 'No menu items yet. Add your first item!'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  menuItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md line-clamp-2">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${getCategoryBadgeColors(item.category.name)}`}>
                          {language === 'ar' ? (item.category.nameInArabic || item.category.name) : item.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          ₪{item.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all duration-200 font-semibold text-sm flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {language === 'ar' ? 'تعديل' : 'Edit'}
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

