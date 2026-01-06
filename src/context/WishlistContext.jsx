import { createContext, useState, useEffect, useContext } from 'react';
// Context files commonly export both hook and provider component
// eslint-disable-next-line react-refresh/only-export-components
import { toast } from 'sonner';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

// eslint-disable-next-line react-refresh/only-export-components
export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error parsing wishlist from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        if (wishlist.find(item => item.id === product.id)) {
            toast.info('Already in wishlist', {
                description: product.name,
                duration: 2000,
            });
            return;
        }

        setWishlist(prev => [...prev, { ...product, addedAt: new Date().toISOString() }]);
        toast.success('Added to wishlist!', {
            description: product.name,
            duration: 2000,
        });
    };

    const removeFromWishlist = (productId) => {
        const item = wishlist.find(i => i.id === productId);
        setWishlist(prev => prev.filter(item => item.id !== productId));
        if (item) {
            toast.success('Removed from wishlist', {
                description: item.name,
                duration: 2000,
            });
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const clearWishlist = () => {
        const count = wishlist.length;
        setWishlist([]);
        if (count > 0) {
            toast.success('Wishlist cleared', {
                description: `Removed ${count} ${count === 1 ? 'item' : 'items'}`,
                duration: 2000,
            });
        }
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            clearWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );

};
