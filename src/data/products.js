// Metro Optics - Product Dataset
// Comprehensive eyewear catalog with realistic data

export const categories = [
    'Eyeglasses',
    'Sunglasses',
    'Reading Glasses',
    'Blue Light Glasses',
    'Kids Glasses',
    'Sports Glasses'
];

export const products = [
    // EYEGLASSES (ID: 1-12)
    {
        id: 'classic-aviator-frame-eg-av-001',
        name: 'Classic Aviator Frame',
        category: 'Eyeglasses',
        price: 2500,
        originalPrice: 3200,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
        description: 'Timeless aviator design with premium metal frame. Lightweight and durable for everyday wear.',
        features: ['Metal frame', 'Adjustable nose pads', 'Spring hinges', 'Anti-reflective coating'],
        variants: {
            colors: ['Gold', 'Silver', 'Black', 'Rose Gold'],
            sizes: ['Small', 'Medium', 'Large']
        },
        inventory: { stock: 45, sku: 'EG-AV-001' },
        ratings: { average: 4.7, count: 128 },
        tags: ['bestseller', 'unisex'],
        isBestseller: true,
        isNew: false
    },
    {
        id: 'modern-rectangle-frame-eg-rc-002',
        name: 'Modern Rectangle Frame',
        category: 'Eyeglasses',
        price: 1800,
        originalPrice: 2400,
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop',
        description: 'Contemporary rectangular design perfect for professional settings. Acetate construction for comfort.',
        features: ['Acetate frame', 'Flexible temples', 'Wide fit', 'Scratch-resistant'],
        variants: {
            colors: ['Black', 'Tortoise', 'Navy', 'Brown'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 32, sku: 'EG-RC-002' },
        ratings: { average: 4.5, count: 89 },
        tags: ['professional', 'unisex'],
        isBestseller: true,
        isNew: false
    },
    {
        id: 'round-vintage-frame-eg-rd-003',
        name: 'Round Vintage Frame',
        category: 'Eyeglasses',
        price: 2200,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop',
        description: 'Retro-inspired round frame with a modern twist. Perfect for making a fashion statement.',
        features: ['Titanium frame', 'Ultra-lightweight', 'Hypoallergenic', 'Anti-glare coating'],
        variants: {
            colors: ['Gold', 'Silver', 'Bronze'],
            sizes: ['Small', 'Medium']
        },
        inventory: { stock: 28, sku: 'EG-RD-003' },
        ratings: { average: 4.8, count: 156 },
        tags: ['trendy', 'vintage'],
        isBestseller: false,
        isNew: true
    },
    {
        id: 'cat-eye-fashion-frame-eg-ce-004',
        name: 'Cat-Eye Fashion Frame',
        category: 'Eyeglasses',
        price: 2100,
        originalPrice: 2800,
        image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop',
        description: 'Elegant cat-eye design for a sophisticated look. Handcrafted acetate frame.',
        features: ['Premium acetate', 'Metallic accents', 'Adjustable fit', 'UV protection'],
        variants: {
            colors: ['Black', 'Red', 'Tortoise', 'Clear'],
            sizes: ['Small', 'Medium']
        },
        inventory: { stock: 22, sku: 'EG-CE-004' },
        ratings: { average: 4.6, count: 94 },
        tags: ['women', 'fashion'],
        isBestseller: false,
        isNew: true
    },
    {
        id: 'minimalist-wire-frame-eg-mw-005',
        name: 'Minimalist Wire Frame',
        category: 'Eyeglasses',
        price: 1600,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop',
        description: 'Ultra-thin metal frame for a barely-there look. Maximum comfort with minimal weight.',
        features: ['Titanium alloy', 'Featherweight', 'Rimless design', 'Memory metal'],
        variants: {
            colors: ['Silver', 'Gold', 'Gunmetal'],
            sizes: ['Medium']
        },
        inventory: { stock: 18, sku: 'EG-WR-005' },
        ratings: { average: 4.4, count: 67 },
        tags: ['minimalist', 'unisex'],
        isBestseller: false,
        isNew: false
    },
    {
        id: 'bold-square-frame-eg-sq-006',
        name: 'Bold Square Frame',
        category: 'Eyeglasses',
        price: 1900,
        originalPrice: 2500,
        image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop',
        description: 'Make a statement with this bold square frame. Perfect for strong personalities.',
        features: ['Thick acetate', 'Bold design', 'Comfortable fit', 'Durable hinges'],
        variants: {
            colors: ['Black', 'Clear', 'Green', 'Blue'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 35, sku: 'EG-SQ-006' },
        ratings: { average: 4.5, count: 112 },
        tags: ['bold', 'unisex'],
        isBestseller: true,
        isNew: false
    },

    // SUNGLASSES (ID: 13-22)
    {
        id: 'classic-wayfarer-sunglasses-sg-wf-013',
        name: 'Classic Wayfarer Sunglasses',
        category: 'Sunglasses',
        price: 3200,
        originalPrice: 4000,
        image: 'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=800&auto=format&fit=crop',
        description: 'Iconic wayfarer style with 100% UV protection. Premium polarized lenses.',
        features: ['Polarized lenses', '100% UV protection', 'Acetate frame', 'Case included'],
        variants: {
            colors: ['Black', 'Tortoise', 'Blue', 'Green'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 52, sku: 'SG-WF-013' },
        ratings: { average: 4.9, count: 245 },
        tags: ['bestseller', 'unisex', 'classic'],
        isBestseller: true,
        isNew: false
    },
    {
        id: 'aviator-polarized-sunglasses-sg-av-014',
        name: 'Aviator Polarized Sunglasses',
        category: 'Sunglasses',
        price: 3500,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop',
        description: 'Premium aviator sunglasses with polarized lenses. Reduces glare for clearer vision.',
        features: ['Polarized', 'Metal frame', 'Adjustable nose pads', 'Scratch-resistant'],
        variants: {
            colors: ['Gold/Green', 'Silver/Grey', 'Black/Blue'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 41, sku: 'SG-AV-014' },
        ratings: { average: 4.8, count: 198 },
        tags: ['bestseller', 'polarized'],
        isBestseller: true,
        isNew: false
    },
    {
        id: 'round-retro-sunglasses-sg-rd-015',
        name: 'Round Retro Sunglasses',
        category: 'Sunglasses',
        price: 2800,
        originalPrice: 3400,
        image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop',
        description: 'Vintage-inspired round sunglasses with modern lens technology.',
        features: ['UV400 protection', 'Metal frame', 'Gradient lenses', 'Vintage style'],
        variants: {
            colors: ['Gold', 'Silver', 'Bronze', 'Black'],
            sizes: ['Small', 'Medium']
        },
        inventory: { stock: 29, sku: 'SG-RD-015' },
        ratings: { average: 4.6, count: 142 },
        tags: ['vintage', 'trendy'],
        isBestseller: false,
        isNew: true
    },
    {
        id: 'sport-wrap-sunglasses-sg-sw-016',
        name: 'Sport Wrap Sunglasses',
        category: 'Sunglasses',
        price: 2400,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&auto=format&fit=crop',
        description: 'Performance sunglasses designed for active lifestyles. Secure wrap-around fit.',
        features: ['Impact-resistant', 'Non-slip grip', 'Ventilated frame', 'Polarized'],
        variants: {
            colors: ['Black', 'Blue', 'Red', 'Grey'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 38, sku: 'SG-SP-016' },
        ratings: { average: 4.7, count: 87 },
        tags: ['sport', 'active'],
        isBestseller: false,
        isNew: false
    },
    {
        id: 'oversized-glamour-sunglasses-sg-ov-017',
        name: 'Oversized Glamour Sunglasses',
        category: 'Sunglasses',
        price: 3800,
        originalPrice: 4800,
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop',
        description: 'Luxurious oversized frames for maximum style and sun protection.',
        features: ['Large lenses', 'Designer style', 'UV400', 'Gradient tint'],
        variants: {
            colors: ['Black', 'Tortoise', 'White', 'Pink'],
            sizes: ['Large']
        },
        inventory: { stock: 24, sku: 'SG-OV-017' },
        ratings: { average: 4.5, count: 156 },
        tags: ['women', 'luxury'],
        isBestseller: false,
        isNew: true
    },

    // READING GLASSES (ID: 23-28)
    {
        id: 'classic-reading-glasses-rg-cl-023',
        name: 'Classic Reading Glasses +1.5',
        category: 'Reading Glasses',
        price: 1200,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop',
        description: 'Comfortable reading glasses with anti-fatigue lenses. Available in multiple strengths.',
        features: ['Multiple strengths', 'Anti-fatigue', 'Lightweight', 'Spring hinges'],
        variants: {
            colors: ['Black', 'Brown', 'Tortoise'],
            sizes: ['One Size']
        },
        inventory: { stock: 65, sku: 'RG-CL-023' },
        ratings: { average: 4.6, count: 234 },
        tags: ['reading', 'affordable'],
        isBestseller: true,
        isNew: false
    },
    {
        id: 'progressive-reading-glasses-rg-pr-024',
        name: 'Progressive Reading Glasses',
        category: 'Reading Glasses',
        price: 2800,
        originalPrice: 3600,
        image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop',
        description: 'No-line progressive lenses for seamless near-to-far vision correction.',
        features: ['Progressive lenses', 'No visible lines', 'Wide reading zone', 'Premium coating'],
        variants: {
            colors: ['Black', 'Grey', 'Brown'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 18, sku: 'RG-PR-024' },
        ratings: { average: 4.8, count: 89 },
        tags: ['progressive', 'premium'],
        isBestseller: false,
        isNew: true
    },

    // BLUE LIGHT GLASSES (ID: 29-34)
    {
        id: 'computer-blue-light-blockers-bl-cp-029',
        name: 'Computer Blue Light Blockers',
        category: 'Blue Light Glasses',
        price: 1800,
        originalPrice: 2400,
        image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop',
        description: 'Protect your eyes from digital screens. Blocks 90% of harmful blue light.',
        features: ['90% blue light blocking', 'Anti-glare', 'Reduces eye strain', 'Clear lenses'],
        variants: {
            colors: ['Black', 'Clear', 'Tortoise'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 48, sku: 'BL-CP-029' },
        ratings: { average: 4.7, count: 412 },
        tags: ['bestseller', 'gaming', 'work'],
        isBestseller: true,
        isNew: false
    },
    {
        id: 'gaming-blue-light-glasses-bl-gm-030',
        name: 'Gaming Blue Light Glasses',
        category: 'Blue Light Glasses',
        price: 2100,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop',
        description: 'Designed for gamers and streamers. Enhanced color contrast and blue light protection.',
        features: ['Enhanced contrast', 'Blue light filter', 'Anti-reflective', 'Lightweight'],
        variants: {
            colors: ['Black', 'Red', 'Blue'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 34, sku: 'BL-GM-030' },
        ratings: { average: 4.8, count: 287 },
        tags: ['gaming', 'tech'],
        isBestseller: true,
        isNew: true
    },

    // KIDS GLASSES (ID: 35-38)
    {
        id: 'kids-flexible-frame-kg-fl-035',
        name: 'Kids Flexible Frame',
        category: 'Kids Glasses',
        price: 1400,
        originalPrice: 1800,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
        description: 'Durable and flexible frames designed for active kids. Virtually unbreakable.',
        features: ['Flexible material', 'Impact-resistant', 'Adjustable temples', 'Safe nose pads'],
        variants: {
            colors: ['Blue', 'Pink', 'Green', 'Purple'],
            sizes: ['Small (Ages 3-6)', 'Medium (Ages 7-12)']
        },
        inventory: { stock: 42, sku: 'KG-FL-035' },
        ratings: { average: 4.9, count: 178 },
        tags: ['kids', 'durable'],
        isBestseller: true,
        isNew: false
    },

    // SPORTS GLASSES (ID: 39-42)
    {
        id: 'cycling-sports-glasses-sp-cy-039',
        name: 'Cycling Sports Glasses',
        category: 'Sports Glasses',
        price: 3200,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&auto=format&fit=crop',
        description: 'Aerodynamic design for cyclists. Photochromic lenses adapt to light conditions.',
        features: ['Photochromic lenses', 'Wind protection', 'Anti-fog', 'Secure fit'],
        variants: {
            colors: ['Black', 'White', 'Red'],
            sizes: ['Medium', 'Large']
        },
        inventory: { stock: 26, sku: 'SP-CY-039' },
        ratings: { average: 4.8, count: 134 },
        tags: ['sport', 'cycling'],
        isBestseller: false,
        isNew: true
    },
    {
        id: 'swimming-goggles-pro-sp-sw-040',
        name: 'Swimming Goggles Pro',
        category: 'Sports Glasses',
        price: 1800,
        originalPrice: 2200,
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop',
        description: 'Professional swimming goggles with anti-fog coating and UV protection.',
        features: ['Anti-fog', 'UV protection', 'Adjustable strap', 'Comfortable seal'],
        variants: {
            colors: ['Black', 'Blue', 'Clear'],
            sizes: ['One Size']
        },
        inventory: { stock: 55, sku: 'SP-SW-040' },
        ratings: { average: 4.7, count: 201 },
        tags: ['sport', 'swimming'],
        isBestseller: true,
        isNew: false
    }
];

// Helper functions
export const getProductById = (id) => products.find(p => p.id === id);

export const getProductsByCategory = (category) =>
    products.filter(p => p.category === category);

export const getBestsellers = (limit = 8) =>
    products.filter(p => p.isBestseller).slice(0, limit);

export const getNewArrivals = (limit = 6) =>
    products.filter(p => p.isNew).slice(0, limit);

export const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
};

export const getProductStats = () => ({
    total: products.length,
    byCategory: categories.map(cat => ({
        category: cat,
        count: products.filter(p => p.category === cat).length
    })),
    bestsellersCount: products.filter(p => p.isBestseller).length,
    newArrivalsCount: products.filter(p => p.isNew).length
});

export default products;
