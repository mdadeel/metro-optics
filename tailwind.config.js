import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            fontFamily: {
                sans: ['Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
                mono: ['Geist Mono', 'SF Mono', 'Monaco', 'monospace'],
            },
            colors: {
                border: "var(--color-border)",
                input: "var(--color-border)",
                ring: "var(--color-accent)",
                background: "var(--color-bg)",
                foreground: "var(--color-text-primary)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    light: "var(--color-primary-light)",
                    dark: "var(--color-primary-dark)",
                    foreground: "var(--color-text-on-dark)",
                },
                surface: "var(--color-surface)",
                "surface-secondary": "var(--color-secondary)",
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-text-primary)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    light: "var(--color-accent-light)",
                    dark: "var(--color-accent-dark)",
                    soft: "var(--color-accent-soft)",
                    foreground: "var(--color-text-on-accent)",
                },
                gold: {
                    DEFAULT: "var(--color-gold)",
                    light: "var(--color-gold-light)",
                    dark: "var(--color-gold-dark)",
                },
                neutral: {
                    50: "#FAFAFA",
                    100: "#F5F5F5",
                    200: "#E8E8E8",
                    300: "#D4D4D4",
                    400: "#A3A3A3",
                    500: "#737373",
                    600: "#525252",
                    700: "#404040",
                    800: "#262626",
                    900: "#171717",
                },
                destructive: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
                muted: { DEFAULT: "var(--color-secondary)", foreground: "var(--color-text-secondary)" },
                card: { DEFAULT: "var(--color-surface)", foreground: "var(--color-text-primary)" },
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                DEFAULT: "var(--radius)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
                full: "var(--radius-full)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                DEFAULT: "var(--shadow)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                xl: "var(--shadow-xl)",
                accent: "var(--shadow-accent)",
                gold: "var(--shadow-gold)",
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(24px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.6s ease-out",
                "fade-in": "fade-in 0.4s ease-out",
            },
        },
    },
    plugins: [tailwindcssAnimate],
};
