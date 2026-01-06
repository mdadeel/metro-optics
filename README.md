<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
</p>

<h1 align="center">👓 Metro Optics</h1>

<p align="center">
  <strong>Premium Eyewear E-Commerce Platform</strong>
  <br />
  <em>Modern • Accessible • Prescription-Ready</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-admin-panel">Admin</a>
</p>

---

## ✨ Features

### 🛒 **Customer Experience**
- **Product Catalog** — Browse eyewear with advanced filtering by category, price, and style
- **Product Quick View** — Quickly preview products without leaving the current page
- **Smart Cart System** — Real-time cart with persistent storage
- **Wishlist** — Save favorite items for later purchase
- **Order Tracking** — Track order status with detailed timeline
- **Invoice Generation** — Download professional invoices for purchases

### 👤 **User Account**
- **Secure Authentication** — Firebase-powered login/register with password recovery
- **Profile Management** — Update personal information and preferences
- **Address Book** — Manage multiple shipping addresses
- **Order History** — View past orders and reorder with one click
- **Prescription Upload** — Securely store and manage eyewear prescriptions

### 🛡️ **Admin Dashboard**
- **Analytics Dashboard** — Real-time sales metrics and performance charts
- **Order Management** — Process, update, and track all customer orders
- **Product Management** — Full CRUD operations with image uploads
- **Customer Database** — View and manage customer accounts
- **Payment Tracking** — Monitor payment status and transactions
- **CMS Integration** — Manage site content and settings
- **Reports & Insights** — Generate sales and inventory reports

### 🎨 **Design & UX**
- **Responsive Design** — Flawless experience on all devices
- **Dark/Light Theme** — System-aware theme switching
- **Smooth Animations** — Polished micro-interactions
- **Accessibility First** — WCAG compliant with skip links and ARIA labels
- **SEO Optimized** — Meta tags and structured data for search engines

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="100">

**Frontend**

</td>
<td>

| Technology | Purpose |
|:---|:---|
| React 19 | UI Framework |
| React Router 7 | Client-side routing |
| TailwindCSS 4 | Utility-first styling |
| Radix UI | Accessible component primitives |
| Lucide React | Icon library |
| React Hook Form + Zod | Form validation |

</td>
</tr>
<tr>
<td align="center" width="100">

**Backend**

</td>
<td>

| Technology | Purpose |
|:---|:---|
| Firebase Auth | User authentication |
| Cloud Firestore | NoSQL database |
| Firebase Storage | Image/file storage |
| Firestore Rules | Security & validation |

</td>
</tr>
<tr>
<td align="center" width="100">

**Tooling**

</td>
<td>

| Technology | Purpose |
|:---|:---|
| Vite 7 | Build tool & dev server |
| ESLint | Code linting |
| PostCSS | CSS processing |
| Vercel | Deployment platform |

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v18+`
- **npm** or **yarn**
- **Firebase Project** with Auth & Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/metro-optics.git
cd metro-optics

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
# Start development server
npm run dev

# Open in browser
# → http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
metro-optics/
├── 📂 public/               # Static assets
├── 📂 src/
│   ├── 📂 assets/           # Images, fonts, etc.
│   ├── 📂 components/       # Reusable UI components
│   │   ├── 📂 ui/           # Shadcn/Radix primitives
│   │   └── 📂 profile/      # Profile-specific components
│   ├── 📂 context/          # React Context providers
│   │   ├── AuthContext      # Authentication state
│   │   ├── CartContext      # Shopping cart state
│   │   ├── ProductContext   # Product catalog state
│   │   ├── OrderContext     # Order management
│   │   └── WishlistContext  # User wishlist
│   ├── 📂 data/             # Static data & constants
│   ├── 📂 hooks/            # Custom React hooks
│   ├── 📂 layouts/          # Page layout components
│   ├── 📂 lib/              # Utility functions
│   ├── 📂 pages/            # Route page components
│   │   ├── 📂 admin/        # Admin panel pages
│   │   └── 📂 profile/      # User profile pages
│   ├── 📂 styles/           # Component-specific CSS
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── .env.example             # Environment template
├── firestore.rules          # Firebase security rules
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── vercel.json              # Deployment config
```

---

## 🔐 Admin Panel

Access the admin dashboard at `/admin/login`.

### Features Overview

| Module | Description |
|:---|:---|
| **Dashboard** | Sales analytics, order stats, revenue charts |
| **Orders** | View, update status, process refunds |
| **Products** | Add, edit, delete products with variants |
| **Customers** | User management and order history |
| **Payments** | Transaction monitoring and verification |
| **CMS** | Site content and homepage management |
| **Reports** | Sales, inventory, and performance reports |
| **Settings** | Store configuration and preferences |

---

## 📄 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

## 🌐 Deployment

This project is configured for deployment on **Vercel**:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

The `vercel.json` is pre-configured for SPA routing.

---

## 📝 License

This project is proprietary software. All rights reserved.

---

<p align="center">
  <sub>Built with ❤️ for clear vision and style</sub>
</p>
