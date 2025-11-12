export type Category = {
  id: string;
  name: string;
  nameInArabic?: string;
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  nameInArabic?: string;
  descriptionInArabic?: string;
  price: number;
  imageUrl?: string;
  category: Category;
}

