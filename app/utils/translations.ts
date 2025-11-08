import { Category, CategoryName } from '../types';

export const categoryTranslations: Record<CategoryName, string> = {
  Grill: 'גריל',
  Salads: 'סלטים',
  Drinks: 'משקאות',
};

export function getCategoryName(category: Category): string {
  return categoryTranslations[category.name];
}

