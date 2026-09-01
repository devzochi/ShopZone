import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Product, Order } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const LOCAL_PRODUCTS_KEY = 'commerceos_products_store';
const LOCAL_ORDERS_KEY = 'commerceos_orders_store';

function getLocalProducts(): Product[] {
  try {
    const saved = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('commerceos_products_changed', { detail: products }));
  } catch {}
}

function getLocalOrders(): Order[] {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('commerceos_orders_changed', { detail: orders }));
  } catch {}
}

// Initialize default products into Firestore if empty or return local
export async function initializeProductsCollection(customList?: Product[]): Promise<Product[]> {
  if (isFirebaseConfigured && db) {
    try {
      const defaultList = customList || DEFAULT_PRODUCTS;
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const snap = await getDocs(colRef);
      
      if (snap.empty) {
        // Seed default catalog
        for (const prod of defaultList) {
          const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
          await setDoc(docRef, {
            ...prod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        return defaultList;
      } else {
        const items: Product[] = [];
        snap.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...(docSnap.data() as any) } as Product);
        });
        return items;
      }
    } catch (error) {
      console.warn('Could not sync products from Firestore, using local catalog:', error);
    }
  }
  return getLocalProducts();
}

// Seed default products alias
export const seedDefaultProducts = initializeProductsCollection;

// Subscribe to live products catalog
export function subscribeToProducts(onUpdate: (products: Product[]) => void) {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (snapshot.empty) {
          onUpdate(DEFAULT_PRODUCTS);
          return;
        }
        const items: Product[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...(d.data() as any) } as Product);
        });
        onUpdate(items);
      }, (error) => {
        console.warn('Products subscription error (falling back to local):', error);
        onUpdate(getLocalProducts());
      });
    } catch (e) {
      console.warn('Failed to subscribe to cloud products:', e);
    }
  }

  // Local storage listener
  onUpdate(getLocalProducts());
  const handler = (e: any) => {
    if (e.detail) {
      onUpdate(e.detail);
    } else {
      onUpdate(getLocalProducts());
    }
  };
  window.addEventListener('commerceos_products_changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('commerceos_products_changed', handler);
    window.removeEventListener('storage', handler);
  };
}

// Add or update product in Firestore & Local (Admin)
export async function saveProductToFirestore(product: Product): Promise<void> {
  const current = getLocalProducts();
  const index = current.findIndex(p => p.id === product.id);
  const updatedList = index >= 0
    ? current.map(p => p.id === product.id ? { ...product, updatedAt: new Date().toISOString() } : p)
    : [{ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  saveLocalProducts(updatedList);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
      await setDoc(docRef, {
        ...product,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not sync product to Firestore:', e);
    }
  }
}

// Delete product from Firestore & Local (Admin)
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const current = getLocalProducts();
  const filtered = current.filter(p => p.id !== productId);
  saveLocalProducts(filtered);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Could not delete product from Firestore:', e);
    }
  }
}

// Create new purchase order in Firestore & Local
export async function createOrderInFirestore(order: Order): Promise<string> {
  const current = getLocalOrders();
  const newOrder = {
    ...order,
    createdAt: order.createdAt || new Date().toISOString(),
  };
  saveLocalOrders([newOrder, ...current]);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(docRef, newOrder);
    } catch (error) {
      console.warn('Could not sync order to Firestore:', error);
    }
  }
  return order.id;
}

// Subscribe to all orders (Admin)
export function subscribeToAllOrders(onUpdate: (orders: Order[]) => void) {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...(d.data() as any) } as Order);
        });
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(items);
      }, (err) => {
        console.warn('Orders cloud subscription error:', err);
        onUpdate(getLocalOrders());
      });
    } catch (e) {
      console.warn('Error subscribing to orders:', e);
    }
  }

  // Local storage orders listener
  onUpdate(getLocalOrders());
  const handler = (e: any) => {
    if (e.detail) {
      onUpdate(e.detail);
    } else {
      onUpdate(getLocalOrders());
    }
  };
  window.addEventListener('commerceos_orders_changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('commerceos_orders_changed', handler);
    window.removeEventListener('storage', handler);
  };
}

// Subscribe to user orders (Customer)
export function subscribeToUserOrders(userId: string, onUpdate: (orders: Order[]) => void) {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Order;
          if (data.userId === userId || (!data.userId && data.customerEmail)) {
            items.push({ id: d.id, ...data });
          }
        });
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(items);
      }, (err) => {
        console.warn('User orders cloud subscription error:', err);
        const filtered = getLocalOrders().filter(o => o.userId === userId || !o.userId);
        onUpdate(filtered);
      });
    } catch (e) {
      console.warn('Error subscribing to user orders:', e);
    }
  }

  const getFiltered = () => getLocalOrders().filter(o => o.userId === userId || !o.userId);
  onUpdate(getFiltered());
  const handler = () => {
    onUpdate(getFiltered());
  };
  window.addEventListener('commerceos_orders_changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('commerceos_orders_changed', handler);
    window.removeEventListener('storage', handler);
  };
}

// Update order status (Admin)
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const current = getLocalOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
  saveLocalOrders(updated);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not update order status in Firestore:', e);
    }
  }
}

