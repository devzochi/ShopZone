export interface Product {
  id: string;
  name: string;
  category: 'electronics' | 'fashion' | 'home' | 'fitness' | 'accessories' | 'lifestyle';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  badge?: {
    text: string;
    type: 'discount' | 'sale' | 'new' | 'trending';
  };
  description: string;
  features?: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  isTrending?: boolean;
  isDeal?: boolean;
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CategoryItem {
  id: string;
  slug: 'electronics' | 'fashion' | 'home' | 'fitness' | 'accessories' | 'lifestyle';
  name: string;
  image: string;
  itemCount: number;
}

