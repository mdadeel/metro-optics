import { createContext, useState, useEffect, useContext } from 'react';
// Context files commonly export both hook and provider component
// eslint-disable-next-line react-refresh/only-export-components
import { initialSiteSettings } from '../data/initialData';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => useContext(SiteSettingsContext);

const defaultPages = {
    about: { title: 'About Us', content: 'Welcome to Metro Optics. We are dedicated to providing premium eyewear...' },
    contact: { title: 'Contact Us', content: 'Get in touch with us at support@metrooptics.com...' },
    privacy: { title: 'Privacy Policy', content: 'Your privacy is important to us...' },
    terms: { title: 'Terms & Conditions', content: 'Please read these terms carefully...' }
};

// eslint-disable-next-line react-refresh/only-export-components
export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('siteSettings_v1');
            const parsed = saved ? JSON.parse(saved) : initialSiteSettings;
            // Always merge with initialSiteSettings to pick up new default fields
            const merged = { ...initialSiteSettings, ...parsed };
            // Ensure pages object exists
            if (!merged.pages) merged.pages = defaultPages;
            return merged;
        } catch (error) {
            console.error('Error parsing site settings from localStorage:', error);
            // Return default settings on error
            return { ...initialSiteSettings, pages: defaultPages };
        }
    });

    useEffect(() => {
        localStorage.setItem('siteSettings_v1', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updatePage = (pageId, pageData) => {
        setSettings(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                [pageId]: { ...prev.pages[pageId], ...pageData }
            }
        }));
    };

    const getPage = (pageId) => {
        return settings.pages?.[pageId] || defaultPages[pageId];
    };

    return (
        <SiteSettingsContext.Provider value={{ settings, updateSettings, updatePage, getPage }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
