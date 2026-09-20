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
import { toast } from 'sonner';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(localProducts);
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
          setProducts(localProducts);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const q = query(collection(db, 'products'), orderBy('name'));
        const snapshot = await getDocs(q);
        if (!cancelled) {
          const fetched = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setProducts(fetched.length > 0 ? fetched : localProducts);
          setLoading(false);
        }
      } catch (err) {
        console.error('Product fetch error:', err);
        if (!cancelled) {
          setError(err.message);
          setProducts(localProducts);
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
