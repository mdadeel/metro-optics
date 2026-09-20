# 🔍 Metro Optics — Full Website Audit & Repair Report

**Project:** Metro Optics (premium eyewear e-commerce, Bangladesh)
**Stack:** React 19 + Vite 7 · Tailwind CSS · Firebase (Auth / Firestore / Storage) · react-router v7 · Vercel
**Scope:** styling pipeline, runtime logic, routing, data layer, security, performance, architecture.

---

## 1. 🚨 Root Cause: "All styling broken (navbar to everything)"

### The bug
`package.json` was upgraded to **Tailwind v4** (`tailwindcss ^4` + `@tailwindcss/postcss`), but the CSS entry
`src/styles/tailwind.css` still used **Tailwind v3 directives**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Tailwind v4's PostCSS plugin no longer understands `@tailwind` directives. Result (verified in the built CSS):

- No **preflight/reset** → default browser styles leaked through.
- Only a random fragment of utilities existed (`.flex`, `.grid`…) — everything the components actually rely on was
  missing: **`bg-primary`, `text-foreground`, `text-muted-foreground`, `backdrop-blur-2xl`, `animate-spin`,
  `animate-pulse`, responsive `sm:`/`lg:` variants, `dark:` variants, `tailwindcss-animate` classes
  (`animate-in`, `fade-in`, `slide-in-from-bottom-4`)**.
- The theme in `tailwind.config.js` (colors mapped to CSS variables, shadows, radii, `darkMode: ["class"]`,
  `tailwindcss-animate` plugin) was never loaded — v4 ignores the v3 config unless told otherwise.

Since the Navbar, Footer, CartDrawer, Checkout, admin panels etc. are styled with Tailwind utilities, the entire
site collapsed visually. **This was the single root cause — not dozens of separate CSS bugs.**

### The fix (v4-native migration of the entry point)
| File | Change |
|---|---|
| `src/styles/tailwind.css` | Replaced the v3 directives with `@import "tailwindcss";` + `@config "../../tailwind.config.js";` (loads the legacy JS config: theme tokens, `tailwindcss-animate`, content globs) + `@custom-variant dark (&:where(.dark, .dark *));` (class-based dark mode) |
| `postcss.config.js` | `tailwindcss: {}` → `'@tailwindcss/postcss': {}` (v4 plugin; autoprefixer no longer needed — v4 prefixes internally) |
| `src/main.jsx` | Import order fixed: `tailwind.css` **before** `index.css`, so preflight loads first and the design tokens / page CSS can override it |

### Verified result (grep against the built CSS + live dev server)
`animate-spin` ✅ · `backdrop-blur-2xl` ✅ · `text-muted-foreground` ✅ · `bg-primary → var(--color-primary)` ✅ ·
`dark:` variants ✅ · `sm:`/`lg:` responsive ✅ · `animate-in` / `fade-in` / `slide-in-from-bottom` ✅ ·
preflight ✅ · `@keyframes` from config: only `fade-up`/`fade-in` animations are absent, and they are **unused in
any JSX** (animations come from the `motion` library) — no visual loss.

Dev-server smoke test: `/` 200 · `tailwind.css` 200 · `index.css` 200 · zero errors in the Vite log.
Production build: ✅ CSS grew 252K → 312K (the previously-missing utilities are now really in the bundle).

> Note: `tailwindcss-animate` is a v3-era plugin but keeps working because `@config` loads it. If you later drop
> `@config`, swap it for `tw-animate-css` and move the theme tokens into a v4 `@theme` block.

---

## 2. 🏗️ Architecture Review

**Finding — half-finished parallel refactor (dead, broken code):** a second architecture existed alongside the live
app and was never wired in: `src/store/` (Zustand, `index.js` re-exported 6 **undefined** identifiers),
`src/services/`, `src/repositories/`, `src/hooks/` (`useCommon.js` had a duplicate-declaration parse error;
`usePerformance.js` misused hooks/refs), `src/utils/performance.js` (used `React`/hooks without importing them),
`ModernApp.jsx`, `ModernShop.jsx`, `ModernProductCard.jsx`, `ui/Modern*.jsx`, `ui/LoadingComponents.jsx`
(used `cn` without importing it). None of it was reachable from `main.jsx`, so the build passed while the linter
reported 80 errors.

**Action:** verified nothing live imports any of it (import-graph check + build), then deleted:
`src/store/`, `src/services/`, `src/repositories/`, `src/utils/`, `src/ModernApp.jsx`, `src/pages/ModernShop.jsx`,
`src/components/ModernProductCard.jsx`, `src/components/ui/LoadingComponents.jsx`, `src/components/ui/Modern*.jsx`.
`usePagination.jsx` / `useToast.jsx` / `Toast.css` were restored after the build proved they **are** live (used by
admin pages).

**Structure that remains is sound:** `context/` providers (Auth, Product, Cart, Wishlist, Order, SiteSettings) →
`layouts/` (Store, Profile) → `pages/` + `components/` + `styles/` (tokens → base → components → pages → dark
mode) + `config/firebase.js`. Keep it.

**Bundle:** main JS chunk was **864 kB** — admin panels were inside it. Admin routes are now `React.lazy` code-split
(AdminCMS 14 kB, AdminSettings 15 kB, etc. load on demand).

---

## 3. 🗄️ System Design Check

**Firestore rules (`firestore.rules`)** — solid: ownership checks on orders, admin-only writes for
products/settings, self-registration locked to `role == 'customer'`, role changes blocked on update, default-deny
footer. ✅ No changes needed.

**Gaps found & fixed:**
- The per-user orders query (`where userId == uid` + `orderBy createdAt desc`) requires a **composite index** that
  was never declared — if it isn't provisioned, the listener errors and order history silently renders **empty**.
  → `OrderContext` now sorts client-side (no index dependency), and `firestore.indexes.json` +
  `firebase.json` were added so `firebase deploy --only firestore` provisions rules + the index for future
  server-side sorting.
- `.env.example` documents all required `VITE_FIREBASE_*` vars; `config/firebase.js` degrades gracefully when they
  are missing (falls back to the local product catalogue instead of crashing). ✅

---

## 4. 🐛 Bug Fixes (all applied)

| # | Severity | File | What was wrong | Fix & why it works |
|---|---|---|---|---|
| 1 | 🔴 P0 | `src/styles/tailwind.css`, `postcss.config.js`, `src/main.jsx` | Tailwind v4 + v3 directives → utilities never generated (see §1) | v4-native entry + `@config`; import order so preflight precedes custom CSS |
| 2 | 🔴 P0 | `src/pages/OrderTracking.jsx` | Called `getOrder(...)` — **doesn't exist** (context exports `getOrderById`) → the page **crashed** on submit; also `Number(orderId)` coerced Firestore string IDs (`classic-aviator-…`) to `NaN`, so tracking could never succeed | Uses `getOrderById` + new `fetchOrderById` fallback; no numeric coercion; case-insensitive status matching; sign-in guidance for guests (rules only allow owners to read orders); loading state |
| 3 | 🔴 P0 | `src/context/OrderContext.jsx` | Missing composite index made user order history fail silently; weird no-op setState pattern | `where`-only query + client-side sort; direct reset; added `fetchOrderById()` via `getDoc` |
| 4 | 🟠 P1 | `src/pages/Checkout.jsx` + `Invoice.jsx` | Invoice showed **Subtotal = total − 100**, misstating the 5% tax as part of subtotal | Checkout now stores `subtotal` / `shipping` / `tax` / `total` on the order; Invoice renders stored values with exact reconstruction fallback for legacy orders |
| 5 | 🟠 P1 | `src/pages/Checkout.jsx` → `Invoice.jsx` | Placing an order navigated to `/invoice/:id` before the Firestore snapshot delivered it → **"Order not found"** flash/false error | Invoice falls back to a direct `fetchOrderById` getDoc (IDOR-safe per rules) |
| 6 | 🟠 P1 | `src/pages/Checkout.jsx` | **"Credit / Debit Card"** was selectable but no gateway exists → orders recorded as paid by card | Option disabled with "Coming soon" + explanatory toast |
| 7 | 🟠 P1 | `src/context/CartContext.jsx` | Toasts + `openCart()` fired **inside** the `setCart` updater → React StrictMode double-invokes updaters → duplicate "Added to cart!" toasts | State update separated from side effects |
| 8 | 🟠 P1 | `src/context/AuthContext.jsx` | `{!loading && children}` gated the **entire app** behind the auth check → white screen on slow connections | Children always render; `ProtectedRoute`/`AdminRoute` already handle the loading state themselves |
| 9 | 🟠 P1 | `src/context/ProductContext.jsx` | `collection(db, …)` with `db = null` (no env vars) threw on every startup (caught only by luck via try/catch) | Explicit `if (!db) return;` guard; state initialised with the local catalogue; console.log spam removed |
| 10 | 🟡 P2 | `src/components/Navbar.jsx` | Search input rendered but did **nothing** | Submits to `/shop?search=…`, closes panel, clears input |
| 11 | 🟡 P2 | `src/pages/Shop.jsx` | Read `?search=` once via `window.location` and **ignored `?category=`** → all Footer category links were dead | `useSearchParams`-driven search + category (React-recommended guarded render sync, no effect cascade) |
| 12 | 🟡 P2 | `src/App.jsx` | `/seed-data` seeder route was **public in production** | Gated behind `import.meta.env.DEV` |
| 13 | 🟡 P2 | `index.html` | Google-Fonts **Inter** was loaded but the design system uses self-hosted **Geist Sans/Mono** (via `@fontsource` in `base.css`) — pure render-blocking waste | Removed |
| 14 | 🟡 P2 | `src/App.jsx` | 864 kB monolithic bundle | Admin section lazy-loaded with Suspense fallback |
| 15 | ⚪ P3 | `firestore.indexes.json`, `firebase.json` | Missing deploy tooling for rules/indexes | Added |
| 16 | ⚪ P3 | Lint | 80 errors + 17 warnings (mostly from the dead refactor) | **0 errors / 7 warnings** (remaining warnings = cosmetic `react-refresh` notices on context hook exports) |

---

## 5. 🎨 UI/UX Notes (post-fix state)

- **Accessibility is strong in Checkout** — labelled inputs, `aria-invalid`, `aria-describedby`, `role="alert"`
  errors, focusable payment options. ✅ Keep this pattern elsewhere.
- Dark mode: token-overrides via `html.dark` + class-based `dark:` variants — both now actually work with the fixed
  pipeline. ✅
- Empty/success states exist for cart, checkout, tracking. ✅
- Remaining polish ideas (not blockers): a real **404 page** (currently a silent redirect to `/`), the Footer
  newsletter is a stub (`console.log` — wire it to Firestore or an email provider), `#returns` / `#shipping` /
  `#privacy` footer links are placeholders, and cart-drawer focus trapping could be tightened.

## 6. ✨ Recommended Next Steps (not yet implemented)

1. **Deploy Firestore**: `firebase deploy --only firestore` (rules + the new composite index).
2. Add a proper **404 route** instead of the catch-all redirect.
3. Wire the **newsletter** form to a real backend (Firestore collection or email service).
4. Consider migrating `tailwind.config.js` fully into a v4 `@theme` block + `tw-animate-css` to drop the legacy
   `@config` bridge.
5. Order-status values: admin uses capitalized statuses; tracking now matches case-insensitively, but standardising
   on lowercase in the admin UI would keep data clean.

## 7. ✅ Final Checklist

| Check | Result |
|---|---|
| `npm run build` | ✅ passes (admin chunks code-split) |
| `npm run lint` | ✅ 0 errors (was 80) / 7 cosmetic warnings |
| Tailwind utilities in built CSS (theme colors, animations, responsive, dark:) | ✅ verified by grep |
| Preflight present, custom CSS wins cascade | ✅ (import order fixed) |
| Dev server smoke test (`/`, `tailwind.css`, `index.css`) | ✅ 200s, no errors |
| Order tracking flow | ✅ crash fixed, ID handling fixed, guest guidance added |
| Checkout → Invoice flow | ✅ race fixed, math correct, card option disabled |
| Cart toasts / drawer | ✅ no more StrictMode double-fire |
| App startup without Firebase env vars | ✅ graceful local-catalogue fallback |
| Dead/broken parallel architecture | ✅ removed (live hooks preserved) |
| Security: seeder route, IDOR on invoices, Firestore rules | ✅ dev-gated, ownership-checked, rules unchanged & sound |

---

*Generated by Buffy @ Freebuff — audit & repair session.*
