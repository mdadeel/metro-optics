import { create } from 'zustand';
import { toast } from 'sonner';

export const useCompareStore = create((set, get) => ({
  items: [],

  addToCompare: (product) => {
    const { items } = get();
    if (items.some((i) => i.id === product.id)) {
      toast.info('Product is already in comparison');
      return;
    }
    if (items.length >= 4) {
      toast.error('You can compare up to 4 products at a time.');
      return;
    }
    set({ items: [...items, product] });
    toast.success(`Added ${product.name} to comparison!`);
  },

  removeFromCompare: (productId) => {
    set({ items: get().items.filter((i) => i.id !== productId) });
  },

  clearCompare: () => {
    set({ items: [] });
  },

  isInCompare: (productId) => {
    return get().items.some((i) => i.id === productId);
  },

  getTotalItems: () => {
    return get().items.length;
  },
}));
