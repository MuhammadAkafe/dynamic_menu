export type CategoryName = 'Grill' | 'Salads' | 'Drinks';

export type Category = {
  id: number;
  name: CategoryName;
  nameInArabic?: string;
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  nameInArabic?: string;
  descriptionInArabic?: string;
  price: number;
  category: Category;
}

