import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const navigationLinks = [
  { label: 'Optical frames', to: '/shop?category=optical' },
  { label: 'Sunglasses', to: '/shop?category=sunglasses' },
  { label: 'Blue light', to: '/shop?category=blue-light' },
  { label: 'Reading', to: '/shop?category=reading' },
  { label: 'Sports', to: '/shop?category=sports' },
  { label: 'Contact lenses', to: '/shop?category=contact-lenses' },
];

export default function MegaMenu() {
  return (
    <nav className="mo-nav" aria-label="Main navigation">
      <div className="mo-nav__inner">
        <div className="mo-nav__links">
          {navigationLinks.map((item) => (
            <Link key={item.label} to={item.to}>{item.label}</Link>
          ))}
          <Link to="/shop?deals=true" className="mo-nav__sale">The edit</Link>
        </div>
        <Link to="/about" className="mo-nav__story">
          Our story <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <Link to="/shop" className="mo-nav__all">
          Shop all <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
