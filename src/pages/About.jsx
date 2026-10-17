import { createElement } from 'react';
import { Award, Eye, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../lib/seo';
import { useSiteSettings } from '../context/SiteSettingsContext';

const values = [
  {
    icon: Eye,
    title: 'Vision first',
    text: 'We put comfort, clear vision, and considered fit at the centre of every frame choice.',
  },
  {
    icon: Award,
    title: 'Quality, considered',
    text: 'We look for thoughtful materials, careful finishing, and designs made to be worn often.',
  },
  {
    icon: Heart,
    title: 'A more personal fit',
    text: 'Finding the right frame should feel guided, not overwhelming. We make the details easier to understand.',
  },
  {
    icon: ShieldCheck,
    title: 'Straightforward service',
    text: 'Clear product information, dependable support, and no unnecessary surprises along the way.',
  },
];

export default function About() {
  const { getPage } = useSiteSettings();
  const pageContent = getPage('about');
  const title = pageContent?.title || 'Eyewear with a clearer point of view.';
  const story = pageContent?.content || 'Metro Optics brings together considered eyewear and helpful guidance, making it easier to find frames that feel like you.';
  const aboutSchema = buildWebPageSchema({
    name: title,
    description: story,
    path: '/about',
    type: 'AboutPage',
  });

  return (
    <div className="about-page">
      <SEO
        title={title}
        description={story}
        url="/about"
        structuredData={[
          aboutSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About us', path: '/about' },
          ]),
        ]}
      />
      <div className="about-container">
        <Breadcrumb items={[{ label: 'About us' }]} />

        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-hero-copy">
            <p className="mo-eyebrow">A CLEARER POINT OF VIEW</p>
            <h1 id="about-title" className="about-title">{title}</h1>
            <p className="about-subtitle">Thoughtful eyewear, selected for real life and the way you see yourself.</p>
            <Link to="/shop" className="mo-button mo-button--dark">Explore the collection <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="about-hero-image">
            <img src="/metro-hero.webp" alt="A customer wearing warm-toned optical frames in natural light" width="1264" height="848" fetchPriority="high" decoding="async" />
            <span>METRO OPTICS — SEE YOURSELF CLEARLY</span>
          </div>
        </section>

        <section className="about-section about-story" aria-labelledby="about-story-title">
          <div className="about-section-intro">
            <p className="mo-eyebrow">OUR APPROACH</p>
            <h2 id="about-story-title" className="about-section-title">The right frame should feel like yours.</h2>
          </div>
          <div className="about-story-content">
            <div className="about-text">{story}</div>
          </div>
        </section>

        <section className="about-section about-values" aria-labelledby="about-values-title">
          <div className="about-section-intro">
            <p className="mo-eyebrow">WHAT MATTERS TO US</p>
            <h2 id="about-values-title" className="about-section-title">Good vision. Good design. Good guidance.</h2>
          </div>
          <div className="about-values-grid">
            {values.map(({ icon, title: valueTitle, text }) => (
              <article className="about-value-card" key={valueTitle}>
                <div className="about-value-icon">{createElement(icon, { size: 21, 'aria-hidden': true })}</div>
                <h3 className="about-value-title">{valueTitle}</h3>
                <p className="about-value-text">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta" aria-labelledby="about-cta-title">
          <div><p className="mo-eyebrow">YOUR NEXT FAVOURITE PAIR</p><h2 id="about-cta-title">A little more you, in every frame.</h2></div>
          <Link to="/shop" className="mo-button mo-button--light">Find your frames <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </div>
    </div>
  );
}
