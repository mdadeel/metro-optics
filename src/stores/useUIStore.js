import { create } from 'zustand';

export const useUIStore = create((set) => ({
  mobileNavOpen: false,
  searchModalOpen: false,
  quickViewProduct: null,
  compareDrawerOpen: false,

  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

  setSearchModalOpen: (searchModalOpen) => set({ searchModalOpen }),
  toggleSearchModal: () => set((state) => ({ searchModalOpen: !state.searchModalOpen })),

  setQuickViewProduct: (quickViewProduct) => set({ quickViewProduct }),
  closeQuickView: () => set({ quickViewProduct: null }),

  setCompareDrawerOpen: (compareDrawerOpen) => set({ compareDrawerOpen }),
  toggleCompareDrawer: () => set((state) => ({ compareDrawerOpen: !state.compareDrawerOpen })),
}));
