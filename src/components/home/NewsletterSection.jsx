import { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success('Thank you! Welcome to Metro Optics VIP vision club.');
  };

  return (
    <section className="bg-gradient-to-r from-[#1a1a2e] via-[#24243e] to-[#1a1a2e] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
      <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary-light flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6 text-primary" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
          Join Metro Optics VIP Vision Club
        </h3>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg mx-auto">
          Receive an instant <strong className="text-amber-400">$20 discount code</strong> for your next frame or prescription lens order, plus early-bird access to limited designer drops.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm pt-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>You're in! Check your inbox for your $20 VIP gift voucher.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-gray-400 border border-white/20 outline-none focus:border-primary text-sm backdrop-blur-sm"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-sm shrink-0"
            >
              Get $20 Off
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Zero Spam. Unsubscribe anytime.</span>
          </span>
          <span>•</span>
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>
    </section>
  );
}
