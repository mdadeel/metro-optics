import { Glasses } from 'lucide-react';

/** Shared, compact Metro Optics mark used throughout customer-facing UI. */
export default function LogoMark({ size = 22, className }) {
  return <Glasses size={size} strokeWidth={1.65} className={className} aria-hidden="true" />;
}
