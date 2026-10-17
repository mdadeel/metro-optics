import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { SITE_CONFIG } from '../../lib/constants';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import LogoMark from './LogoMark';

const shopLinks = [
  ['Eyeglasses', '/shop?category=optical'],
  ['Sunglasses', '/shop?category=sunglasses'],
  ['Blue light', '/shop?category=blue-light'],
  ['Reading glasses', '/shop?category=reading'],
  ['Shop all frames', '/shop'],
];

const helpLinks = [
  ['Contact us', '/contact'],
  ['Frequently asked questions', '/faq'],
  ['Track your order', '/track-order'],
  ['Returns & exchanges', '/contact'],
];

export default function Footer() {
  const { settings } = useSiteSettings();
  const phone = settings.sitePhone || SITE_CONFIG.phone;
  const email = settings.siteEmail || SITE_CONFIG.email;

  return (
    <footer className="mo-footer">
      <div className="mo-footer__main">
        <div className="mo-footer__brand">
          <Link to="/" className="mo-logo mo-logo--footer" aria-label="Metro Optics home">
            <span className="mo-logo__mark"><LogoMark size={22} /></span>
            <span className="mo-logo__type"><strong>METRO</strong><span>OPTICS</span><small>SEE YOURSELF CLEARLY</small></span>
          </Link>
          <p>Thoughtful eyewear, carefully selected. Frames for wherever the day takes you.</p>
          <Link to="/about" className="mo-footer__about">A little about us <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>

        <div className="mo-footer__column">
          <h2>Shop</h2>
          <ul>{shopLinks.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>
        </div>

        <div className="mo-footer__column">
          <h2>We're here to help</h2>
          <ul>{helpLinks.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>
        </div>

        <div className="mo-footer__column mo-footer__contact">
          <h2>Say hello</h2>
          <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}><Phone size={15} aria-hidden="true" /><span>{phone}</span></a>
          <a href={`mailto:${email}`}><Mail size={15} aria-hidden="true" /><span>{email}</span></a>
          <span className="mo-footer__location"><MapPin size={15} aria-hidden="true" /><span>Here when you need us.</span></span>
          <a className="mo-footer__social" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Metro Optics on Instagram"><Instagram size={17} aria-hidden="true" /></a>
        </div>
      </div>

      <div className="mo-footer__bottom">
        <span>© {new Date().getFullYear()} Metro Optics. All rights reserved.</span>
        <div><Link to="/contact">Privacy</Link><Link to="/contact">Terms</Link><span>Made for seeing more.</span></div>
      </div>
    </footer>
  );
}
