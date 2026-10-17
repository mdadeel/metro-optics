import { Link } from 'react-router-dom';
import { ArrowUpRight, Truck } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="mo-topbar">
      <div className="mo-topbar__inner">
        <p><Truck size={14} aria-hidden="true" /><span>Complimentary delivery on orders over $99</span></p>
        <div className="mo-topbar__links">
          <Link to="/track-order">Track an order</Link>
          <Link to="/faq">Need a hand? <ArrowUpRight size={12} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
}
