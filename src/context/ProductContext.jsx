import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../config/firebase';
import { products as localProducts } from '../data/products';
import { useProductStore, getMaxPriceFromProducts } from '../stores/useProductStore';
import { DEMO_PRODUCTS } from '../lib/constants';
import { toast } from 'sonner';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Fetch once safely without setState-in-effect
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    let cancelled = false;

    async function fetchProducts() {
      if (!hasFirebaseConfig || !db) {
        if (!cancelled) {
          const maxPrice = getMaxPriceFromProducts(DEMO_PRODUCTS);
          setProducts(DEMO_PRODUCTS);
          setLoading(false);
          useProductStore.setState((prev) => ({
            products: prev.products?.length > 0 ? prev.products : DEMO_PRODUCTS,
            priceRange: [0, Math.max(prev.priceRange?.[1] || 500, maxPrice)],
            loading: false,
          }));
        }
        return;
      }

      try {
        setLoading(true);
        useProductStore.setState({ loading: true, error: null });
        const q = query(collection(db, 'products'), orderBy('name'));
        const snapshot = await getDocs(q);
        if (!cancelled) {
          const fetched = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          const resolved = fetched.length > 0 ? fetched : DEMO_PRODUCTS;
          const maxPrice = getMaxPriceFromProducts(resolved);
          setProducts(resolved);
          useProductStore.setState((prev) => ({
            products: resolved,
            priceRange: [0, Math.max(prev.priceRange?.[1] || 500, maxPrice)],
            loading: false,
            error: null,
          }));
          setLoading(false);
        }
      } catch (err) {
        console.error('Product fetch error:', err);
        if (!cancelled) {
          setError(err.message);
          setProducts(DEMO_PRODUCTS);
          const maxPrice = getMaxPriceFromProducts(DEMO_PRODUCTS);
          useProductStore.setState((prev) => ({
            products: prev.products?.length > 0 ? prev.products : DEMO_PRODUCTS,
            priceRange: [0, Math.max(prev.priceRange?.[1] || 500, maxPrice)],
            loading: false,
            error: err.message,
          }));
          setLoading(false);
        }
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const addProduct = useCallback(async (product) => {
    if (!hasFirebaseConfig || !db) {
      const newProduct = {
        ...product,
        id: `local-${Date.now()}`,
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success('Product added successfully (demo mode)');
      return newProduct;
    }
    try {
      const { id: _, ...productData } = product;
      const docRef = await addDoc(collection(db, 'products'), productData);
      toast.success('Product added successfully');
      return { id: docRef.id, ...productData };
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product');
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id, updatedProduct) => {
    if (!hasFirebaseConfig || !db) {
      setProducts((prev) =>
        prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updatedProduct } : p))
      );
      toast.success('Product updated successfully (demo mode)');
      return;
    }
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updatedProduct);
      toast.success('Product updated successfully');
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    if (!hasFirebaseConfig || !db) {
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      toast.success('Product deleted successfully (demo mode)');
      return;
    }
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
      throw err;
    }
  }, []);

  const getProductById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  const getProductsByCategory = useCallback(
    (category) =>
      category === 'all'
        ? products
        : products.filter((p) => p.category?.toLowerCase() === category?.toLowerCase()),
    [products]
  );

  const getBestsellers = useCallback(
    (limit = 8) => {
      const bestsellers = products.filter((p) => p.isBestseller === true).slice(0, limit);
      return bestsellers.length > 0 ? bestsellers : products.slice(0, limit);
    },
    [products]
  );

  const getNewArrivals = useCallback(
    (limit = 6) => products.filter((p) => p.isNew).slice(0, limit),
    [products]
  );

  const searchProducts = useCallback(
    (queryText) => {
      if (!queryText) return products;
      const lower = queryText.toLowerCase();
      return products.filter(
        (p) =>
          p.name?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(lower))
      );
    },
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByCategory,
      getBestsellers,
      getNewArrivals,
      searchProducts,
    }),
    [
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByCategory,
      getBestsellers,
      getNewArrivals,
      searchProducts,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}

export default ProductContext;
