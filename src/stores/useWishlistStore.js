import { create } from 'zustand';
import { toast } from 'sonner';

const WISHLIST_STORAGE_KEY = 'metro_wishlist';

function getStoredWishlist() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
}

export const useWishlistStore = create((set, get) => ({
  items: getStoredWishlist(),

  toggleWishlist: (product) => {
    const { items } = get();
    const exists = items.some((item) => item.id === product.id);
    let updated;

    if (exists) {
      updated = items.filter((item) => item.id !== product.id);
      toast.info(`Removed ${product.name} from wishlist`);
    } else {
      updated = [...items, product];
      toast.success(`Added ${product.name} to wishlist!`);
    }

    set({ items: updated });
    saveWishlist(updated);
  },

  removeFromWishlist: (productId) => {
    const { items } = get();
    const updated = items.filter((item) => item.id !== productId);
    set({ items: updated });
    saveWishlist(updated);
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  getTotalItems: () => {
    return get().items.length;
  },
}));
