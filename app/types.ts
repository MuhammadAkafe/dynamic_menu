export type CategoryName = 'Grill' | 'Salads' | 'Drinks';

export type Category = {
  id: number;
  name: CategoryName;
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
}

export interface User {
  email: string;
  password: string;
}

