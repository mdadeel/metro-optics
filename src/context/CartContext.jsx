import { createContext, useState, useEffect, useContext } from 'react';
// Context files commonly export both hook and provider component
 
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

 
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id && item.lensType === product.lensType);

        // Update state first — side effects (toasts) stay OUTSIDE the updater so
        // React StrictMode's double-invoked updaters can't fire them twice.
        setCart(prev => {
            const alreadyThere = prev.find(item => item.id === product.id && item.lensType === product.lensType);
            if (alreadyThere) {
                return prev.map(item =>
                    item.id === product.id && item.lensType === product.lensType
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        if (existing) {
            toast.success(`Increased quantity of ${product.name}`, {
                description: `Now ${existing.quantity + 1} in cart`,
                duration: 2000,
            });
        } else {
            toast.success('Added to cart!', {
                description: product.name,
                duration: 2000,
            });
        }
        openCart(); // Open drawer when adding item
    };

    // Updated to use compound key (id + lensType) for correct item identification
    const removeFromCart = (id, lensType = null) => {
        const item = cart.find(i => i.id === id && (lensType === null || i.lensType === lensType));
        setCart(prev => prev.filter(item => !(item.id === id && (lensType === null || item.lensType === lensType))));
        if (item) {
            toast.success('Removed from cart', {
                description: item.name,
                duration: 2000,
            });
        }
    };

    // Updated to use compound key (id + lensType) for correct item identification
    const updateQuantity = (id, quantity, lensType = null) => {
        // Remove item if quantity is 0 or negative
        if (quantity <= 0) {
            removeFromCart(id, lensType);
            return;
        }

        // Cap at reasonable maximum (99 items)
        const validQuantity = Math.min(Math.max(quantity, 1), 99);

        setCart(prev => prev.map(item =>
            (item.id === id && (lensType === null || item.lensType === lensType))
                ? { ...item, quantity: validQuantity }
                : item
        ));
    };

    const clearCart = () => {
        const itemCount = cart.length;
        setCart([]);
        if (itemCount > 0) {
            toast.success('Cart cleared', {
                description: `Removed ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`,
                duration: 2000,
            });
        }
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, isCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
};
