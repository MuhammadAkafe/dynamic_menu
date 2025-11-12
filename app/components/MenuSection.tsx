'use client';

import { useState } from 'react';
import { MenuItem, Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MenuSectionProps {
  category: Category;
  items: MenuItem[];
  onClick?: () => void;
  isSelected?: boolean;
}

const getCategoryColors = () => {

  return {
    bg: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
    bgSimple: 'bg-indigo-200 dark:bg-indigo-800',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-600 dark:text-indigo-400',
  };
};

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  colors: ReturnType<typeof getCategoryColors>;
  category: Category;
  language: string;
}

function MenuItemCard({ item, index, colors, category, language }: MenuItemCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transform flex-shrink-0 w-80"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`h-2 ${colors.bgSimple}`}></div>
      {item.imageUrl && !imageError ? (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={item.imageUrl}
            alt={language === 'ar' ? (item.nameInArabic || item.name) : item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className={`h-48 w-full flex items-center justify-center bg-gradient-to-br ${colors.bg}`}>
          <svg className={`w-16 h-16 ${colors.text} opacity-50`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
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
  );
}

export default function MenuSection({ category, items, onClick, isSelected = false }: MenuSectionProps) {
  const colors = getCategoryColors();
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
              <MenuItemCard
                key={item.id}
                item={item}
                index={index}
                colors={colors}
                category={category}
                language={language}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

