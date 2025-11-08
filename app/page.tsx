'use client';

import { useState } from 'react';
import { useMenu } from './contexts/MenuContext';
import MenuSection from './components/MenuSection';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import { Category, CategoryName } from './types';
import { getCategoryName } from './utils/translations';
import { categories } from './category';

const categoryColors: Record<CategoryName, { bg: string; bgSimple: string; border: string; text: string; icon: string }> = {
  Grill: {
    bg: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    bgSimple: 'bg-orange-200 dark:bg-orange-800',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
    icon: '🔥',
  },
  Salads: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    bgSimple: 'bg-green-200 dark:bg-green-800',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-600 dark:text-green-400',
    icon: '🥗',
  },
  Drinks: {
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    bgSimple: 'bg-blue-200 dark:bg-blue-800',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    icon: '🥤',
  },
};

interface CategoryCardProps {
  category: Category;
  itemCount: number;
  onClick: () => void;
}

function CategoryCard({ category, itemCount, onClick }: CategoryCardProps) {
  const colors = categoryColors[category.name as CategoryName];

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl ${colors.bg} border-2 ${colors.border} p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bgSimple} rounded-full -mr-16 -mt-16 opacity-20`}></div>
      <div className="relative z-10">
        <div className="text-5xl mb-4">{colors.icon}</div>
        <h2 className={`text-3xl font-extrabold ${colors.text} mb-2`}>
          {getCategoryName(category)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {itemCount} {itemCount === 1 ? 'פריט' : 'פריטים'} זמינים
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:translate-x-2 transition-transform">
          <span>צפה בתפריט</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const { getItemsByCategory } = useMenu();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Check if we're on the client to prevent hydration mismatch
  const isClient = typeof window !== 'undefined';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              תפריט מסעדה
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              גלה את המנות הטעימות שלנו
            </p>
          </div>
          {!isClient ? (
            <button
              className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2"
              disabled
              suppressHydrationWarning
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              התחברות מנהל
            </button>
          ) : isAuthenticated ? (
            <button
              onClick={() => router.push('/admin')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              לוח בקרה
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              התחברות מנהל
            </button>
          )}
        </div>

        {selectedCategory ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  מציג: <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCategory ? getCategoryName(selectedCategory) : ''}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-semibold text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                חזור לקטגוריות
              </button>
            </div>
            <MenuSection 
              category={selectedCategory} 
              items={getItemsByCategory(selectedCategory)}
            />
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category : Category) => (
              <CategoryCard 
                key={category.id}
                category={category} 
                itemCount={getItemsByCategory(category).length}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
