import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
}) => {
    const siteTitle = 'Metro Optics - Premium Eyewear';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = import.meta.env.VITE_APP_URL || 'https://metrooptics.com';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const defaultImage = `${siteUrl}/og-image.jpg`;
    const defaultDescription = 'Shop premium eyeglasses, sunglasses, and contact lenses at Metro Optics. Free shipping, 7-day returns, and expert eye care.';

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />
            <meta property="twitter:image" content={image || defaultImage} />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};

export default SEO;
