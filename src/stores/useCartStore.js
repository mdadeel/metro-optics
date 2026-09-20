import { create } from 'zustand';
import { toast } from 'sonner';

const CART_STORAGE_KEY = 'metro_cart';

function getStoredCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

export const useCartStore = create((set, get) => ({
  items: getStoredCart(),

  addToCart: (product, quantity = 1, options = {}) => {
    const { items } = get();
    const selectedColor = options.selectedColor || product.colors?.[0] || 'Standard';
    const selectedSize = options.selectedSize || product.sizes?.[0] || 'Standard';
    const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;

    const existingIndex = items.findIndex((item) => item.cartItemId === cartItemId);
    let updated;

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...items,
        {
          ...product,
          cartItemId,
          selectedColor,
          selectedSize,
          quantity,
        },
      ];
    }

    set({ items: updated });
    saveCart(updated);
    toast.success(`Added ${product.name} to cart!`);
  },

  removeFromCart: (cartItemId) => {
    const { items } = get();
    const updated = items.filter((item) => item.cartItemId !== cartItemId);
    set({ items: updated });
    saveCart(updated);
    toast.info('Item removed from cart');
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    const { items } = get();
    const updated = items.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    );
    set({ items: updated });
    saveCart(updated);
  },

  clearCart: () => {
    set({ items: [] });
    saveCart([]);
  },

  // Derived helpers
  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0 || subtotal >= 99) return 0;
    return 9.99;
  },

  getTax: () => {
    return get().getSubtotal() * 0.0825; // Standard 8.25% tax
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShipping() + get().getTax();
  },
}));
