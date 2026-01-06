// Script to generate slug IDs for all products
import fs from 'fs';

// Read the products file
const productsPath = './src/data/products.js';
let content = fs.readFileSync(productsPath, 'utf8');

// Function to create slug from name and SKU
function createSlug(name, sku) {
    const namePart = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const skuPart = sku.toLowerCase();
    return `${namePart}-${skuPart}`;
}

// Replace all numeric IDs with slugs
// Pattern: id: '6', followed by name and SKU
const idPattern = /id: '(\d+)',\s+name: '([^']+)',[\s\S]*?sku: '([^']+)'/g;

content = content.replace(idPattern, (match, id, name, sku) => {
    const slug = createSlug(name, sku);
    return match.replace(`id: '${id}'`, `id: '${slug}'`);
});

// Write back
fs.writeFileSync(productsPath, content, 'utf8');
console.log('✅ Product IDs converted to slugs');
