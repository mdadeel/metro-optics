import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { products as localSeedData } from '../data/products';
import { toast } from 'sonner';

const SeederPage = () => {
    const { addProduct, products } = useProducts();
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState([]);

    const performSeed = async () => {
        if (products.length > 0) {
            if (!confirm("Database is not empty. Add duplicate products?")) return;
        }

        setLoading(true);
        let count = 0;
        try {
            const variants = ['Classic', 'Urban', 'Premium'];

            for (const baseProduct of localSeedData) {
                // Add 3 variants for each base product
                for (let i = 0; i < 3; i++) {
                    const variantLabel = variants[i];
                    const seedProduct = {
                        ...baseProduct,
                        name: `${baseProduct.name} (${variantLabel})`,
                        price: baseProduct.price + (i * 150),
                        stock: 20 + Math.floor(Math.random() * 30),
                        tags: [...(baseProduct.tags || []), variantLabel.toLowerCase()],
                        createdAt: new Date().toISOString(),
                        rating: 4 + Math.random(),
                        reviewCount: Math.floor(Math.random() * 50)
                    };

                    await addProduct(seedProduct);
                    count++;
                    setLog(prev => [...prev, `Added: ${seedProduct.name}`]);
                }
            }
            toast.success(`Success! Added ${count} products.`);
        } catch (e) {
            console.error(e);
            toast.error("Error seeding database: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 20, textAlign: 'center', fontFamily: 'system-ui' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 20 }}>📦 Database Seeder Tool</h1>

            <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 20 }}>
                <p><strong>Current Product Count:</strong> {products.length}</p>
                <p>Click the button below to generate ~48 products based on your data templates.</p>
            </div>

            <button
                onClick={performSeed}
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    fontSize: '18px',
                    background: loading ? '#ccc' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'generating products...' : 'GENERATE 48 PRODUCTS'}
            </button>

            <div style={{ marginTop: 20 }}>
                <a href="/" style={{ color: '#2563eb' }}>← Return to Home</a>
                <span style={{ margin: '0 10px' }}>|</span>
                <a href="/shop" style={{ color: '#2563eb' }}>Go to Shop →</a>
            </div>

            {log.length > 0 && (
                <div style={{
                    marginTop: 30,
                    textAlign: 'left',
                    background: '#000',
                    color: '#0f0',
                    padding: 15,
                    borderRadius: 6,
                    height: 300,
                    overflowY: 'auto',
                    fontFamily: 'monospace'
                }}>
                    {log.map((l, i) => <div key={i}>{l}</div>)}
                </div>
            )}
        </div>
    );
};

export default SeederPage;
