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
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "var(--color-gray-300)",
                input: "var(--color-gray-300)",
                ring: "var(--color-primary)",
                background: "var(--color-white)",
                foreground: "var(--color-gray-900)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-white)",
                },
                secondary: {
                    DEFAULT: "var(--color-gray-100)",
                    foreground: "var(--color-gray-900)",
                },
                destructive: {
                    DEFAULT: "var(--color-error)",
                    foreground: "var(--color-white)",
                },
                muted: {
                    DEFAULT: "var(--color-gray-100)",
                    foreground: "var(--color-gray-500)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-gray-900)",
                },
                popover: {
                    DEFAULT: "var(--color-white)",
                    foreground: "var(--color-gray-900)",
                },
                card: {
                    DEFAULT: "var(--color-white)",
                    foreground: "var(--color-gray-900)",
                },
            },
            borderRadius: {
                lg: "4px", // Defaulting to 4px for sharp look
                md: "4px", // Defaulting to 4px for sharp look
                sm: "2px", // Smaller radius for minor elements
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [tailwindcssAnimate],
}
