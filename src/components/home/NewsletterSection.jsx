import { useState } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    toast.success('You’re on the list. Keep an eye on your inbox.');
  };

  return (
    <section className="mo-newsletter" aria-labelledby="mo-newsletter-title">
      <div className="mo-newsletter__symbol"><Mail size={19} aria-hidden="true" /></div>
      <div className="mo-newsletter__copy">
        <p className="mo-eyebrow">GOOD THINGS, IN FOCUS</p>
        <h2 id="mo-newsletter-title" className="mo-display">A little more clarity in your inbox.</h2>
        <p>New arrivals, style notes, and the occasional something special. No noise, ever.</p>
      </div>
      {subscribed ? (
        <div className="mo-newsletter__success" role="status">
          <span><Check size={16} aria-hidden="true" /></span>
          <div><strong>You’re on the list.</strong><small>Thanks for joining the Metro Optics edit.</small></div>
        </div>
      ) : (
        <form className="mo-newsletter__form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="mo-newsletter-email">Email address</label>
          <input
            id="mo-newsletter-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            autoComplete="email"
            required
          />
          <button type="submit" aria-label="Subscribe to the newsletter">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <span>By subscribing, you agree to receive updates from Metro Optics.</span>
        </form>
      )}
    </section>
  );
}
