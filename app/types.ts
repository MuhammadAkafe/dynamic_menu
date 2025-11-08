export type CategoryName = 'Grill' | 'Salads' | 'Drinks';

export type Category = {
  id: number;
  name: CategoryName;
  nameInHebrew?: string;
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
}

