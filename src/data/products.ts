import { CategoryItem, Product } from '../types';

export const HERO_IMAGE = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop";

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    slug: 'electronics',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    itemCount: 24,
  },
  {
    id: 'cat-2',
    slug: 'fashion',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    itemCount: 38,
  },
  {
    id: 'cat-3',
    slug: 'home',
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=600&auto=format&fit=crop',
    itemCount: 19,
  },
  {
    id: 'cat-4',
    slug: 'fitness',
    name: 'Fitness',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600&auto=format&fit=crop',
    itemCount: 16,
  },
  {
    id: 'cat-5',
    slug: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    itemCount: 42,
  },
  {
    id: 'cat-6',
    slug: 'lifestyle',
    name: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    itemCount: 29,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aura Studio Headphones',
    category: 'electronics',
    price: 129.00,
    originalPrice: 151.76,
    rating: 4.8,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
    ],
    badge: {
      text: '-15%',
      type: 'discount',
    },
    description: 'Precision-tuned active noise cancelling headphones with custom 40mm bio-cellulose drivers, ultra-soft memory foam ear cushions, and 45-hour battery life.',
    features: [
      'Active Noise Cancellation with Transparency Mode',
      '45-hour playback with fast USB-C charge (10m = 5h)',
      'Custom acoustic tuning for high-fidelity response',
      'Aircraft-grade aluminum matte hinge architecture'
    ],
    colors: [
      { name: 'Matte White', hex: '#f3f4f6' },
      { name: 'Space Grey', hex: '#374151' },
      { name: 'Oatmeal Beige', hex: '#e5e0d8' }
    ],
    inStock: true,
    isTrending: true,
    isDeal: true,
  },
  {
    id: 'prod-2',
    name: 'Nova Smartwatch Pro',
    category: 'electronics',
    price: 249.00,
    rating: 4.9,
    reviewsCount: 85,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Sleek OLED ambient display timepiece crafted from grade 5 titanium. Continuous heart-rate variability, sleep architecture, and 7-day battery endurance.',
    features: [
      'Always-on 1.4" Retina AMOLED screen',
      'Titanium unibody with sapphire crystal glass',
      '50m water resistant (5 ATM rating)',
      'Advanced biometric tracking + GPS telemetry'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#18181b' },
      { name: 'Titanium Silver', hex: '#9ca3af' },
      { name: 'Midnight Navy', hex: '#1e293b' }
    ],
    inStock: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'prod-3',
    name: 'Artisan Ceramic Mug',
    category: 'home',
    price: 24.00,
    rating: 4.7,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536939459926-301728717817?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'Hand-thrown stoneware mug with a tactile matte glaze finish. Designed with ergonomic counter-balance geometry for the everyday morning ritual.',
    features: [
      'Crafted from high-fire natural stoneware clay',
      'Dishwasher and microwave safe',
      '12 oz (350ml) comfortable capacity',
      'Heat-retaining thick ceramic wall profile'
    ],
    colors: [
      { name: 'Sand Beige', hex: '#d6cbbe' },
      { name: 'Warm Terracotta', hex: '#c27d60' },
      { name: 'Slate Moss', hex: '#656d61' }
    ],
    inStock: true,
    isTrending: true,
  },
  {
    id: 'prod-4',
    name: 'Essential Leather Wallet',
    category: 'accessories',
    price: 45.00,
    originalPrice: 60.00,
    rating: 4.6,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606503829023-3eb381273934?q=80&w=800&auto=format&fit=crop',
    ],
    badge: {
      text: 'SALE',
      type: 'sale',
    },
    description: 'Ultra-slim full-grain vegetable-tanned leather bifold. Houses 8 cards plus flat folded bills without pocket bulk, developing a rich organic patina over time.',
    features: [
      'Full-grain Tuscan vegetable-tanned leather',
      'Integrated RFID protection shield',
      'Dedicated quick-draw card thumb slot',
      'Hand-stitched reinforced wax thread seams'
    ],
    colors: [
      { name: 'Tan Caramel', hex: '#9a6138' },
      { name: 'Espresso Brown', hex: '#3e2723' },
      { name: 'Charcoal Black', hex: '#262626' }
    ],
    inStock: true,
    isTrending: true,
    isDeal: true,
  },
  {
    id: 'prod-5',
    name: 'Minimalist Linen Overshirt',
    category: 'fashion',
    price: 88.00,
    originalPrice: 110.00,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    badge: {
      text: 'NEW',
      type: 'new',
    },
    description: 'Breathable 100% French flax linen woven in a relaxed tailored silhouette with horn buttons and double chest pockets.',
    features: [
      '100% Normandy certified linen',
      'Garment washed for immediate softness',
      'Hidden interior passport pocket',
      'Reinforced gusset side seams'
    ],
    colors: [
      { name: 'Raw Natural', hex: '#e3dcce' },
      { name: 'Olive Drab', hex: '#5b6348' },
      { name: 'Navy Dusk', hex: '#212c3d' }
    ],
    inStock: true,
    isNew: true,
  },
  {
    id: 'prod-6',
    name: 'Eco-Grip Precision Yoga Mat',
    category: 'fitness',
    price: 74.00,
    rating: 4.9,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop',
    description: 'Non-slip natural tree rubber mat with alignment laser markers and high-density cushioning to support joint stability.',
    features: [
      '100% natural tree rubber & organic top coat',
      'Laser-etched posture alignment grid',
      '5mm optimal balance density',
      'Includes recycled cotton carry strap'
    ],
    colors: [
      { name: 'Basalt Charcoal', hex: '#374151' },
      { name: 'Dusty Rose', hex: '#b38289' },
      { name: 'Sage Green', hex: '#607262' }
    ],
    inStock: true,
  },
  {
    id: 'prod-7',
    name: 'Matte Gooseneck Precision Kettle',
    category: 'lifestyle',
    price: 95.00,
    originalPrice: 120.00,
    rating: 4.9,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    badge: {
      text: '-20%',
      type: 'discount',
    },
    description: 'Counterbalanced precision pour-over electric kettle with digital degree-by-degree temperature regulation and stopwatch.',
    features: [
      'PID temperature controller (135°F to 212°F)',
      '60-minute temperature hold mode',
      'Ergonomic weighted walnut handle',
      'Tapered fluted pour spout'
    ],
    colors: [
      { name: 'Matte Black', hex: '#171717' },
      { name: 'Pure Chalk', hex: '#f5f5f5' }
    ],
    inStock: true,
    isDeal: true,
  },
  {
    id: 'prod-8',
    name: 'Architect Matte Desk Lamp',
    category: 'home',
    price: 115.00,
    rating: 4.7,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
    description: '360-degree rotational articulating task lamp with diffused touch-dimmable warm LED array.',
    features: [
      'Full spectrum 95+ CRI glare-free light',
      'Integrated wireless fast-charging base',
      'Cast aluminum counterbalance joints',
      'Warm ambient nightlight mode'
    ],
    colors: [
      { name: 'Matte Slate', hex: '#475569' },
      { name: 'Off White', hex: '#f1f1f1' }
    ],
    inStock: true,
    isNew: true,
  },
];
