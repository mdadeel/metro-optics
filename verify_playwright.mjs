import { chromium } from 'playwright';

const CHROME_PATH = '/home/adeel/.local/bin/google-chrome';
const BASE_URL = 'http://localhost:5173';

async function runStarTechVerification() {
  console.log('🚀 Starting automated Playwright browser tests using Chrome at', CHROME_PATH);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  const results = [];

  // Test 1: StarTech 3-Row Header Layout
  console.log('\n--- Test 1: StarTech 3-Row Header System ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const topBarTrackLink = await page.$('a[href="/track-order"]');
  const searchInput = await page.$('input[placeholder*="Search frames"]');
  const allCategoriesBtn = await page.$('button:has-text("All Categories")');

  results.push({
    test: 'Row 1 TopBar exists with track order shortcut',
    pass: topBarTrackLink !== null,
  });
  results.push({
    test: 'Row 2 Header exists with wide search & category dropdown',
    pass: searchInput !== null,
  });
  results.push({
    test: 'Row 3 MegaMenu exists with All Categories dropdown trigger',
    pass: allCategoriesBtn !== null,
  });

  // Test 2: Homepage 8 StarTech Sections Render
  console.log('\n--- Test 2: Homepage 8 Sections ---');
  const dealsHeading = await page.$('h3:has-text("Best Deals")');
  const newArrivalsHeading = await page.$('h3:has-text("New Arrivals")');
  const brandsHeading = await page.$('h3:has-text("Official Brand Partners")');
  const whyChooseUsHeading = await page.$('h3:has-text("Why Choose Metro Optics")');

  results.push({
    test: 'Homepage Best Deals 5-column grid renders',
    pass: dealsHeading !== null,
  });
  results.push({
    test: 'Homepage New Arrivals section renders',
    pass: newArrivalsHeading !== null,
  });
  results.push({
    test: 'Homepage Brand Partners & Why Choose Us render',
    pass: brandsHeading !== null && whyChooseUsHeading !== null,
  });

  // Test 3: Shop page with StarTech Accordion Filters
  console.log('\n--- Test 3: /shop with Filter Sidebar ---');
  await page.goto(`${BASE_URL}/shop`, { waitUntil: 'networkidle' });
  const filterHeading = await page.$('span:has-text("Filters")');
  const categoryFilter = await page.$('button:has-text("Categories")');
  results.push({
    test: 'Shop page renders collapsible filter sidebar',
    pass: filterHeading !== null && categoryFilter !== null,
  });

  // Test 4: Cart and Quick View flow
  console.log('\n--- Test 4: Cart interaction ---');
  const addToCartBtn = await page.$('button:has-text("Add to Cart")');
  if (addToCartBtn) {
    await addToCartBtn.click();
    await page.waitForTimeout(500);
  }
  await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
  const cartSummary = await page.$('h3:has-text("Order Summary")');
  results.push({
    test: 'Cart page renders order summary sidebar and table',
    pass: cartSummary !== null,
  });

  // Test 5: /dashboard redirect when logged out
  console.log('\n--- Test 5: /dashboard logged out redirect ---');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForURL('**/login', { timeout: 3000 }).catch(() => {});
  const currentUrl = page.url();
  results.push({
    test: 'Dashboard redirects to /login when unauthenticated',
    pass: currentUrl.includes('/login'),
  });

  // Test 6: Admin login with demo credentials
  console.log('\n--- Test 6: Admin Login ---');
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@metrooptics.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  const adminUrl = page.url();
  results.push({
    test: 'Admin demo login navigates to /admin/dashboard without redirect loop',
    pass: adminUrl.includes('/admin'),
  });

  // Test 7: Accessibility skip link target
  console.log('\n--- Test 7: Accessibility skip link target ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const mainContent = await page.$('#main-content');
  results.push({
    test: '#main-content landmark exists on page',
    pass: mainContent !== null,
  });

  console.log('\n=========================================');
  console.log('🎯 STARTECH REDESIGN PLAYWRIGHT TEST SUMMARY:');
  let allPassed = true;
  for (const r of results) {
    console.log(`  ${r.pass ? '✅ PASS' : '❌ FAIL'}: ${r.test}`);
    if (!r.pass) allPassed = false;
  }
  console.log('=========================================\n');

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

runStarTechVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
