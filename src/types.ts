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

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'discount' | 'system';
}

export interface UserAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  phone?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  address?: UserAddress;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shipping: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: UserAddress;
  createdAt: string;
  updatedAt?: string;
}

export type AIModelType = 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  model?: AIModelType;
  searchQueries?: string[];
  sources?: GroundingSource[];
  isGrounding?: boolean;
}
