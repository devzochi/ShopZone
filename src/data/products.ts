import { CategoryItem, Product } from '../types';

type CategorySlug = CategoryItem['slug'];

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop';

const CATEGORY_DETAILS: Record<CategorySlug, { name: string; image: string; description: string; features: string[]; colors: { name: string; hex: string }[]; prices: number[] }> = {
  electronics: { name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', description: 'Thoughtfully designed technology that brings clear performance and everyday convenience to your setup.', features: ['Premium materials and dependable build quality', 'Easy setup for everyday use', 'Designed for long-lasting performance'], colors: [{ name: 'Midnight', hex: '#1f2937' }, { name: 'Silver', hex: '#9ca3af' }, { name: 'Cloud', hex: '#f3f4f6' }], prices: [129, 249, 89, 159, 69, 119, 179, 99, 139, 79] },
  fashion: { name: 'Fashion', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', description: 'A versatile wardrobe essential made with comfortable materials and a clean, considered silhouette.', features: ['Comfortable fit for everyday wear', 'Durable finish and thoughtful detailing', 'Easy-to-style neutral color palette'], colors: [{ name: 'Natural', hex: '#e7dfd2' }, { name: 'Olive', hex: '#66705a' }, { name: 'Navy', hex: '#233044' }], prices: [88, 72, 64, 118, 54, 96, 82, 128, 48, 76] },
  home: { name: 'Home', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop', description: 'A refined home essential that pairs practical function with calm, modern styling.', features: ['Made for daily use', 'Timeless finish for modern spaces', 'Carefully selected materials'], colors: [{ name: 'Sand', hex: '#d6cbbe' }, { name: 'Slate', hex: '#5e6970' }, { name: 'Terracotta', hex: '#c27d60' }], prices: [24, 115, 68, 42, 89, 56, 132, 38, 74, 49] },
  fitness: { name: 'Fitness', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop', description: 'Reliable training equipment engineered to support focused movement, recovery, and everyday progress.', features: ['Designed for stable, comfortable training', 'Durable materials for repeat sessions', 'Compact and easy to store'], colors: [{ name: 'Charcoal', hex: '#374151' }, { name: 'Sage', hex: '#607262' }, { name: 'Coral', hex: '#d78879' }], prices: [74, 39, 58, 92, 34, 66, 45, 109, 52, 28] },
  accessories: { name: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop', description: 'A polished everyday accessory with functional details and a durable, elevated finish.', features: ['Smart organization for daily essentials', 'Built to travel well', 'Minimal design with practical details'], colors: [{ name: 'Tan', hex: '#9a6138' }, { name: 'Black', hex: '#262626' }, { name: 'Stone', hex: '#b7ada0' }], prices: [45, 68, 32, 59, 84, 38, 72, 29, 55, 96] },
  lifestyle: { name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', description: 'A purposeful lifestyle piece that makes daily rituals more enjoyable and beautifully organized.', features: ['Designed to elevate everyday rituals', 'Simple, intuitive functionality', 'A considered gift-ready finish'], colors: [{ name: 'Matte Black', hex: '#171717' }, { name: 'Chalk', hex: '#f5f5f5' }, { name: 'Forest', hex: '#365341' }], prices: [95, 36, 58, 125, 44, 78, 62, 29, 105, 51] },
};

export const CATEGORIES: CategoryItem[] = (Object.keys(CATEGORY_DETAILS) as CategorySlug[]).map((slug, index) => ({ id: `cat-${index + 1}`, slug, name: CATEGORY_DETAILS[slug].name, image: CATEGORY_DETAILS[slug].image, itemCount: 10 }));

const PRODUCT_NAMES: Record<CategorySlug, string[]> = {
  electronics: ['Aura Studio Headphones', 'Nova Smartwatch Pro', 'Orbit Mini Speaker', 'PixelView 4K Webcam', 'Pulse Wireless Earbuds', 'Arc Mechanical Keyboard', 'Luma Portable Projector', 'Volt Multiport Charger', 'Frame Digital Photo Display', 'Echo Smart Alarm Clock'],
  fashion: ['Minimalist Linen Overshirt', 'Everyday Cotton Tee', 'Tailored Wide-Leg Trousers', 'Merino Crewneck Sweater', 'Canvas Weekend Jacket', 'Ribbed Knit Midi Dress', 'Organic Denim Straight Jean', 'Silk-Blend Scarf', 'Relaxed Poplin Shirt', 'Wool Blend Beanie'],
  home: ['Artisan Ceramic Mug', 'Architect Matte Desk Lamp', 'Woven Throw Blanket', 'Stoneware Serving Bowl', 'Sculptural Vase', 'Linen Duvet Cover Set', 'Oak Wall Shelf', 'Scented Soy Candle', 'Glass Storage Canister Set', 'Textured Bath Towel Set'],
  fitness: ['Eco-Grip Precision Yoga Mat', 'Adjustable Resistance Band Set', 'Cork Recovery Roller', 'Insulated Training Bottle', 'Weighted Jump Rope', 'Performance Training Tee', 'Compact Massage Ball Set', 'Kettlebell 12 kg', 'Stability Balance Disc', 'Quick-Dry Gym Towel'],
  accessories: ['Essential Leather Wallet', 'Structured Everyday Tote', 'Polarized Round Sunglasses', 'Stainless Steel Watch Strap', 'Compact Travel Organizer', 'Leather Key Holder', 'Canvas Laptop Sleeve', 'Minimal Card Case', 'Brass Chain Bracelet', 'Weekend Duffle Bag'],
  lifestyle: ['Matte Gooseneck Precision Kettle', 'Daily Ritual Journal', 'Ceramic Pour-Over Set', 'Travel Coffee Grinder', 'Hardcover Recipe Book', 'Reusable Market Bag', 'Plant Care Starter Kit', 'Classic Card Game Set', 'Picnic Blanket Roll', 'Analog Desk Timer'],
};

// Every product is intentionally assigned its own Unsplash image. Keeping these URLs in a
// dedicated map makes duplicate imagery easy to spot and prevents category-wide placeholders.
const PRODUCT_IMAGE_IDS: Record<CategorySlug, string[]> = {
  electronics: ['1505740420928-5e560c06d30e', '1523275335684-37898b6baf30', '1517336714731-489689fd1ca8', '1498049794561-7780e7231661', '1496181133206-80ce9b88a853', '1527443224154-c4a3942d3acf', '1531297484001-80022131f5a1', '1516321318423-f06f85e504b3', '1550745165-9bc0b252726f', '1526170375885-4d8ecf77b99f'],
  fashion: ['1596755094514-f87e34085b2c', '1521572163474-6864f9cf17ab', '1483985988355-763728e1935b', '1525507119028-ed4c629a60a3', '1551028719-00167b16eac5', '1539109136881-3be0616acf4b', '1543076447-215ad9ba6923', '1529139574466-a303027c1d8b', '1596755389378-c31d21fd1273', '1485968579580-b6d095142e6e'],
  home: ['1616486338812-3dadae4b4ace', '1618220179428-22790b461013', '1600210492486-724fe5c67fb0', '1600607687939-ce8a6c25118c', '1600566753190-17f0baa2a6c3', '1615800002234-05c5b1d7bba8', '1505693416388-ac5ce068fe85', '1513506003901-1e6a229e2d15', '1507473885765-e6ed057f782c', '1549490349-8643362247b5'],
  fitness: ['1517836357463-d25dfeac3438', '1518611012118-696072aa579a', '1538805060514-97d9cc17730c', '1517963879433-6ad2b056d712', '1518609878373-06d740f60d8b', '1544367567-0f2fcb009e0b', '1594737625785-a6cbdabd333c', '1534438327276-14e5300c3a48', '1517838277536-f5f99be5018f', '1576678927484-cc907957088c'],
  accessories: ['1523779917675-b6ed3a42a561', '1511499767150-a48a237f0083', '1531310197839-ccf54634509e', '1503342217505-b0a15ec3261c', '1553062407-98eeb64c6a62', '1584917865442-de89df76afd3', '1548036328-c9fa89d128fa', '1490481651871-ab68de25d43d', '1485230895905-ec40ba36b9bc', '1525845859779-54d477ff291f'],
  lifestyle: ['1514432324607-a09d9b4aefdd', '1495474472287-4d71bcdd2085', '1509042239860-f550ce710b93', '1499951360447-b19be8fe80f5', '1511920170033-f8396924c348', '1494438639946-1ebd1d20bf85', '1502472584811-0a2f2feb8968', '1461988320302-91bde64fc8e4', '1482049016688-2d3e1b311543', '1529156069898-49953e39b3ac'],
};

const productImage = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=85`;

export const PRODUCTS: Product[] = (Object.keys(PRODUCT_NAMES) as CategorySlug[]).flatMap((category) => {
  const details = CATEGORY_DETAILS[category];
  return PRODUCT_NAMES[category].map((name, index) => {
    const price = details.prices[index];
    const isDeal = index === 0 || index === 4;
    const isNew = index === 1 || index === 7;
    return {
      id: `${category}-${index + 1}`,
      name,
      category,
      price,
      originalPrice: isDeal ? Math.round(price * 1.18 * 100) / 100 : undefined,
      rating: Number((4.4 + ((index + category.length) % 6) / 10).toFixed(1)),
      reviewsCount: 24 + ((index + 1) * 17),
      image: productImage(PRODUCT_IMAGE_IDS[category][index]),
      gallery: [productImage(PRODUCT_IMAGE_IDS[category][index])],
      badge: isDeal ? { text: 'SALE', type: 'sale' } : isNew ? { text: 'NEW', type: 'new' } : undefined,
      description: `${name} is ${details.description.charAt(0).toLowerCase()}${details.description.slice(1)}`,
      features: details.features,
      colors: details.colors,
      inStock: true,
      isTrending: index < 2,
      isDeal,
      isNew,
    };
  });
});
