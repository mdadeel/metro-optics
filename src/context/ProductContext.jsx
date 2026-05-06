import { createContext, useState, useEffect, useContext } from 'react';
// Context files commonly export both hook and provider component
// eslint-disable-next-line react-refresh/only-export-components
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { products as localProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

// eslint-disable-next-line react-refresh/only-export-components
export const ProductProvider = ({ children }) => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(false); // Start with false to avoid loading state issues

    useEffect(() => {
        console.log('ProductContext: Initializing...');
        
        // Immediately set local products as fallback
        setProductList(localProducts);
        setLoading(false);
        
        try {
            const q = query(collection(db, 'products'), orderBy('name'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                console.log('ProductContext: Firestore snapshot received', snapshot.docs.length);
                
                const products = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                console.log('ProductContext: Processed products:', products.length);
                
                if (products.length === 0) {
                    console.warn("Firestore returned empty list. Using local data fallback.");
                    setProductList(localProducts);
                } else {
                    setProductList(products);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching products: ", error);
                console.warn("Falling back to local product data");
                setProductList(localProducts);
                setLoading(false);
            });

            return () => {
                console.log('ProductContext: Unsubscribing from Firestore');
                unsubscribe();
            };
        } catch (error) {
            console.error('ProductContext: Error setting up Firestore listener', error);
            // Ensure we always have products available
            setProductList(localProducts);
            setLoading(false);
        }
    }, []);

    const addProduct = async (product) => {
        try {
            // Remove ID if present, let Firestore generate it
            const { id: _, ...productData } = product; // Use _ to indicate intentional unused variable
            await addDoc(collection(db, 'products'), productData);
            toast.success('Product added successfully');
        } catch (error) {
            console.error("Error adding product: ", error);
            toast.error("Failed to add product");
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, updatedProduct);
            toast.success('Product updated successfully');
        } catch (error) {
            console.error("Error updating product: ", error);
            toast.error("Failed to update product");
        }
    };

    const deleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error("Error deleting product: ", error);
            toast.error("Failed to delete product");
        }
    };

    const getBestsellers = (limit = 8) => {
        console.log('getBestsellers called:', { 
            productsLength: productList.length, 
            isBestsellerProducts: productList.filter(p => p.isBestseller).length 
        });
        
        const bestsellers = productList.filter(p => p.isBestseller === true).slice(0, limit);
        
        // If no bestsellers, return first few products as fallback
        if (bestsellers.length === 0 && productList.length > 0) {
            console.log('No bestsellers found, using first products as fallback');
            return productList.slice(0, limit);
        }
        
        return bestsellers;
    };

    const getNewArrivals = (limit = 6) => {
        return productList.filter(p => p.isNew).slice(0, limit);
    };

    const getProductsByCategory = (category) => {
        return productList.filter(p => p.category === category);
    };

    const searchProducts = (queryText) => {
        if (!queryText) return productList;
        const lowerQuery = queryText.toLowerCase();
        return productList.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    };

    return (
        <ProductContext.Provider value={{
            products: productList,
            loading,
            addProduct,
            updateProduct,
            deleteProduct,
            getBestsellers,
            getNewArrivals,
            getProductsByCategory,
            searchProducts
        }}>
            {children}
        </ProductContext.Provider>
    );
};
