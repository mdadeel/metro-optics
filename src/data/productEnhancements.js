// Enhanced Product Data - Images, Specifications, and Reviews
// This file extends the product data with additional rich content for product detail pages

// Multiple product images for gallery (using Unsplash for variety)
export const productImages = {
    '1': [ // Classic Aviator Frame
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop'
    ],
    '2': [ // Modern Rectangle Frame
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop'
    ],
    '3': [ // Round Vintage Frame
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop'
    ],
    '4': [
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop'
    ],
    '5': [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop'
    ],
    '13': [ // Sunglasses
        'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop'
    ]
};

// Detailed specifications for products
export const productSpecs = {
    '1': { // Classic Aviator Frame
        frameMaterial: 'Premium Stainless Steel',
        lensMaterial: 'Polycarbonate',
        frameWidth: '145mm',
        lensWidth: '58mm',
        lensHeight: '50mm',
        bridgeWidth: '16mm',
        templeLength: '140mm',
        weight: '28g',
        shapeStyle: 'Aviator',
        gender: 'Unisex',
        ageGroup: 'Adult',
        warranty: '1 Year Manufacturer Warranty',
        uvProtection: 'UV400',
        springHinges: 'Yes',
        adjustableNosePads: 'Yes'
    },
    '2': {
        frameMaterial: 'Acetate',
        lensMaterial: 'CR-39',
        frameWidth: '140mm',
        lensWidth: '52mm',
        lensHeight: '40mm',
        bridgeWidth: '18mm',
        templeLength: '145mm',
        weight: '32g',
        shapeStyle: 'Rectangle',
        gender: 'Unisex',
        ageGroup: 'Adult',
        warranty: '1 Year Manufacturer Warranty',
        uvProtection: 'UV400',
        springHinges: 'Yes',
        adjustableNosePads: 'No'
    },
    '3': {
        frameMaterial: 'Titanium Alloy',
        lensMaterial: 'Polycarbonate',
        frameWidth: '135mm',
        lensWidth: '48mm',
        lensHeight: '48mm',
        bridgeWidth: '20mm',
        templeLength: '140mm',
        weight: '18g',
        shapeStyle: 'Round',
        gender: 'Unisex',
        ageGroup: 'Adult',
        warranty: '2 Year Manufacturer Warranty',
        uvProtection: 'UV400',
        springHinges: 'Yes',
        adjustableNosePads: 'Yes'
    }
};

// Mock customer reviews
export const productReviews = {
    '1': [
        {
            id: 'r1-1',
            author: 'Sarah Ahmed',
            rating: 5,
            date: '2025-11-15',
            verified: true,
            title: 'Perfect Fit and Style!',
            comment: 'These aviators are exactly what I was looking for. The gold finish is beautiful and they fit perfectly. Very comfortable to wear all day.',
            helpful: 24
        },
        {
            id: 'r1-2',
            author: 'Karim Hassan',
            rating: 4,
            date: '2025-11-10',
            verified: true,
            title: 'Great Quality',
            comment: 'Good quality frames, though the nose pads could be a bit more comfortable. Overall very happy with the purchase.',
            helpful: 12
        },
        {
            id: 'r1-3',
            author: 'Fatima Islam',
            rating: 5,
            date: '2025-11-05',
            verified: true,
            title: 'Love Them!',
            comment: 'Third pair of glasses from Metro Optics. Never disappointed. These are my new favorites!',
            helpful: 18
        },
        {
            id: 'r1-4',
            author: 'Rashed Khan',
            rating: 5,
            date: '2025-10-28',
            verified: false,
            title: 'Excellent Value',
            comment: 'Amazing quality for the price. Lightweight and durable. Highly recommend!',
            helpful: 9
        }
    ],
    '2': [
        {
            id: 'r2-1',
            author: 'Nadia Rahman',
            rating: 5,
            date: '2025-11-18',
            verified: true,
            title: 'Professional Look',
            comment: 'Perfect for the office. The rectangle shape suits my face well and they look very professional.',
            helpful: 15
        },
        {
            id: 'r2-2',
            author: 'Ibrahim Ali',
            rating: 4,
            date: '2025-11-12',
            verified: true,
            title: 'Solid Frames',
            comment: 'Very solid construction. The acetate feels premium. Only wish they came in more colors.',
            helpful: 8
        },
        {
            id: 'r2-3',
            author: 'Ayesha Begum',
            rating: 5,
            date: '2025-11-08',
            verified: true,
            title: 'Great for Daily Wear',
            comment: 'Wearing these every day for work. Comfortable and stylish. No regrets!',
            helpful: 11
        }
    ],
    '3': [
        {
            id: 'r3-1',
            author: 'Tanvir Hossain',
            rating: 5,
            date: '2025-11-20',
            verified: true,
            title: 'Love the Vintage Vibe',
            comment: 'These round frames are amazing! Super lightweight and the vintage look is perfect. Get compliments all the time.',
            helpful: 22
        },
        {
            id: 'r3-2',
            author: 'Sabrina Khan',
            rating: 5,
            date: '2025-11-16',
            verified: true,
            title: 'So Comfortable!',
            comment: 'Can wear these all day without any discomfort. The titanium frame is incredibly light. Worth every taka!',
            helpful: 16
        },
        {
            id: 'r3-3',
            author: 'Farhan Ahmed',
            rating: 4,
            date: '2025-11-14',
            verified: true,
            title: 'Stylish and Practical',
            comment: 'Great frames, very trendy. Minor issue with the nose pads initially but they adjusted well over time.',
            helpful: 7
        },
        {
            id: 'r3-4',
            author: 'Mira Islam',
            rating: 5,
            date: '2025-11-09',
            verified: false,
            title: 'Best Purchase',
            comment: 'Absolutely love these! The round shape is so unique and they feel barely there. Highly recommended!',
            helpful: 13
        }
    ]
};

// Get enhanced product data
export const getEnhancedProduct = (productId) => {
    return {
        images: productImages[productId] || [],
        specifications: productSpecs[productId] || {},
        reviews: productReviews[productId] || []
    };
};

// Get related products based on category and price range
export const getRelatedProducts = (product, allProducts, limit = 4) => {
    if (!product) return [];

    return allProducts
        .filter(p =>
            p.id !== product.id && // Exclude current product
            p.category === product.category && // Same category
            Math.abs(p.price - product.price) <= product.price * 0.3 // Within 30% price range
        )
        .slice(0, limit);
};

export default {
    productImages,
    productSpecs,
    productReviews,
    getEnhancedProduct,
    getRelatedProducts
};
