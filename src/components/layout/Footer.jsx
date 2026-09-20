import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Send,
  Award,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { SITE_CONFIG } from '../../lib/constants';

export default function Footer() {
  const handleNewsletter = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to Metro Optics VIP vision perks!');
  };

  return (
    <footer className="bg-[#151525] text-gray-300 pt-14 pb-8 border-t border-gray-800">
      {/* Top Value Badges Row */}
      <div className="max-w-[1320px] mx-auto px-4 pb-12 border-b border-gray-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Nationwide Delivery</h4>
              <p className="text-xs text-gray-400">On all eyewear orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Prescription Guarantee</h4>
              <p className="text-xs text-gray-400">100% digital lens accuracy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30-Day Hassle-Free Return</h4>
              <p className="text-xs text-gray-400">Money back or exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Certified Opticians</h4>
              <p className="text-xs text-gray-400">Direct telehealth consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 5-Column Mega Footer */}
      <div className="max-w-[1320px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-base">
                M
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Metro<span className="text-primary">Optics</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              New York’s premier optical laboratory and eyewear boutique. Certified precision lenses, Italian acetate craftsmanship, and global designer sunglasses.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{SITE_CONFIG.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{SITE_CONFIG.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/track-order" className="hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors">
                  Prescription Lenses Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Pupillary Distance (PD) Measure
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Warranty & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Optical Store Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Eyewear Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              Featured Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=sunglasses" className="hover:text-primary transition-colors">
                  Polarized Sunglasses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=optical" className="hover:text-primary transition-colors">
                  Designer Optical Frames
                </Link>
              </li>
              <li>
                <Link to="/shop?category=blue-light" className="hover:text-primary transition-colors">
                  ScreenShield Blue Cut
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sports" className="hover:text-primary transition-colors">
                  Sports & Cycling Wraps
                </Link>
              </li>
              <li>
                <Link to="/shop?category=reading" className="hover:text-primary transition-colors">
                  Compact Pocket Readers
                </Link>
              </li>
              <li>
                <Link to="/shop?deals=true" className="text-accent hover:underline font-semibold">
                  Hot Clearance Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: My Account */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              My Account
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary transition-colors">
                  Personal Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile/orders" className="hover:text-primary transition-colors">
                  Order History & Invoices
                </Link>
              </li>
              <li>
                <Link to="/profile/wishlist" className="hover:text-primary transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-primary transition-colors">
                  Product Comparison
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Optician Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter & Guarantee */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              Stay Connected
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Subscribe to get $20 off your first prescription frame + exclusive secret flash drops.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <div className="flex">
                <input
                  type="email"
                  required
                  placeholder="Enter email address..."
                  className="bg-gray-800 text-white text-xs px-3 py-2.5 rounded-l-lg border border-gray-700 outline-none flex-1 focus:border-primary"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2.5 rounded-r-lg transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{SITE_CONFIG.workingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Legal Bottom Bar */}
      <div className="max-w-[1320px] mx-auto px-4 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Metro Optics Corporation. All rights reserved.</p>

        {/* Accepted Payment Badges */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-semibold mr-1">Secured By:</span>
          <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-300">VISA</span>
          <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-300">Mastercard</span>
          <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-300">Amex</span>
          <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-300">PayPal</span>
          <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-300">Apple Pay</span>
        </div>
      </div>
    </footer>
  );
}
