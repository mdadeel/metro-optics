import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import './styles/accessibility.css'
import './styles/tailwind.css'
import { ThemeProvider } from './components/ThemeProvider'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SiteSettingsProvider>
              <ProductProvider>
                <CartProvider>
                  <WishlistProvider>
                    <OrderProvider>
                      <App />
                    </OrderProvider>
                  </WishlistProvider>
                </CartProvider>
              </ProductProvider>
            </SiteSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
