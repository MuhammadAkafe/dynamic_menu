'use client';

import { MenuItem, Category, CategoryName } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MenuSectionProps {
  category: Category;
  items: MenuItem[];
  onClick?: () => void;
  isSelected?: boolean;
}

const categoryColors: Record<CategoryName, { bg: string; bgSimple: string; border: string; text: string }> = {
  Grill: {
    bg: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    bgSimple: 'bg-orange-200 dark:bg-orange-800',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
  },
  Salads: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    bgSimple: 'bg-green-200 dark:bg-green-800',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-600 dark:text-green-400',
  },
  Drinks: {
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    bgSimple: 'bg-blue-200 dark:bg-blue-800',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
  },
};

export default function MenuSection({ category, items, onClick, isSelected = false }: MenuSectionProps) {
  const colors = categoryColors[category.name];
  const { language } = useLanguage();

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-1 w-16 ${colors.bgSimple} rounded-full`}></div>
        <h2 
          onClick={onClick || undefined}
          className={`text-4xl font-extrabold ${colors.text} tracking-tight ${onClick ? 'cursor-pointer hover:scale-105' : ''} transition-all duration-200 ${isSelected ? 'ring-4 ring-offset-4 rounded-xl px-4 py-2 shadow-lg' : ''}`}
        >
          {language === 'ar' ? (category.nameInArabic || category.name) : category.name}
        </h2>
        <div className={`flex-1 h-1 ${colors.bgSimple} rounded-full`}></div>
      </div>
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {items.length === 0 ? (
              <div className="w-full min-w-full">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {language === 'ar' ? 'لا توجد عناصر في هذه الفئة بعد.' : 'No items in this category yet.'}
                </p>
              </div>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transform flex-shrink-0 w-80"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`h-2 ${colors.bgSimple}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {language === 'ar' ? (item.nameInArabic || item.name) : item.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm leading-relaxed line-clamp-3">
                    {language === 'ar' ? (item.descriptionInArabic || item.description) : item.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className={`text-3xl font-extrabold ${colors.text}`}>
                      ₪{item.price.toFixed(2)}
                    </span>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {language === 'ar' ? (category.nameInArabic || category.name) : category.name}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

