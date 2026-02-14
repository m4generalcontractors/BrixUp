import type { Config } from "tailwindcss";

/**
 * BrixUp Tailwind Configuration
 *
 * NOTE: This project uses Tailwind CSS v4 with @tailwindcss/postcss.
 * In Tailwind v4, most theme configuration is done via CSS @theme in globals.css.
 * This config file serves as a supplementary reference and provides
 * compatibility for any plugins or tooling that still read tailwind.config.ts.
 *
 * The canonical source of truth for design tokens is:
 *   - CSS @theme block: /web/src/app/globals.css
 *   - TypeScript tokens: /web/src/lib/design-tokens.ts
 */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // Colors — BrixUp Brand Palette
      // -----------------------------------------------------------------------
      colors: {
        // Primary
        charcoal: {
          50: "#E8E8EC",
          100: "#C5C5CF",
          200: "#9F9FAF",
          300: "#7A7A8F",
          400: "#5C5C72",
          500: "#3D3D55",
          600: "#2E2E44",
          700: "#1A1A2E",
          800: "#131325",
          900: "#0D0D1A",
          950: "#070710",
          DEFAULT: "#1A1A2E",
        },
        gold: {
          50: "#FBF5E6",
          100: "#F3E4BA",
          200: "#EBD38E",
          300: "#E3C262",
          400: "#DBB14A",
          500: "#D4A843",
          600: "#BF933A",
          700: "#A07B30",
          800: "#806226",
          900: "#61491D",
          950: "#413113",
          DEFAULT: "#D4A843",
        },

        // Secondary
        concrete: {
          50: "#EDEDEF",
          100: "#D4D4D9",
          200: "#B8B8C1",
          300: "#9C9CA9",
          400: "#838392",
          500: "#4A4A5A",
          600: "#3E3E4D",
          700: "#323240",
          800: "#262633",
          900: "#1A1A26",
          950: "#0F0F17",
          DEFAULT: "#4A4A5A",
        },
        blueprint: {
          50: "#E8EEF5",
          100: "#C5D4E6",
          200: "#9FB6D4",
          300: "#7998C2",
          400: "#5374A8",
          500: "#2B4C7E",
          600: "#244068",
          700: "#1D3352",
          800: "#16263C",
          900: "#0F1926",
          950: "#080D14",
          DEFAULT: "#2B4C7E",
        },

        // Accent
        safety: {
          50: "#FDE9E0",
          100: "#F9C9B3",
          200: "#F4A786",
          300: "#EE8559",
          400: "#E8632B",
          500: "#D05524",
          600: "#B8481E",
          700: "#9A3C18",
          800: "#7C3013",
          900: "#5E240E",
          950: "#3F1809",
          DEFAULT: "#E8632B",
        },
        success: {
          50: "#E6F9EE",
          100: "#BFF0D4",
          200: "#99E7BA",
          300: "#73DEA0",
          400: "#4DD586",
          500: "#2ECC71",
          600: "#27B062",
          700: "#209452",
          800: "#197843",
          900: "#125C33",
          950: "#0B4024",
          DEFAULT: "#2ECC71",
        },

        // Background surfaces
        offwhite: "#F8F6F0",
        dark: "#0D0D1A",
      },

      // -----------------------------------------------------------------------
      // Typography
      // -----------------------------------------------------------------------
      fontFamily: {
        heading: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        body: [
          "'Space Grotesk'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        code: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "'Cascadia Code'",
          "monospace",
        ],
        // Tailwind defaults
        sans: [
          "'Space Grotesk'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "'Cascadia Code'",
          "monospace",
        ],
      },

      // -----------------------------------------------------------------------
      // Spacing (extends Tailwind defaults)
      // -----------------------------------------------------------------------
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },

      // -----------------------------------------------------------------------
      // Border Radius
      // -----------------------------------------------------------------------
      borderRadius: {
        brix: "8px", // Buttons, inputs
        "brix-card": "12px", // Cards
        "brix-lg": "16px", // Large containers
        "brix-xl": "24px", // Feature sections
      },

      // -----------------------------------------------------------------------
      // Box Shadow
      // -----------------------------------------------------------------------
      boxShadow: {
        brix: "0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
        "brix-hover":
          "0 2px 8px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)",
        "brix-lg":
          "0 4px 12px rgba(0, 0, 0, 0.15), 0 16px 40px rgba(0, 0, 0, 0.12)",
        "gold-glow":
          "0 0 20px rgba(212, 168, 67, 0.3), 0 0 40px rgba(212, 168, 67, 0.15)",
        "gold-glow-strong":
          "0 0 30px rgba(212, 168, 67, 0.5), 0 0 60px rgba(212, 168, 67, 0.25)",
        "blueprint-glow":
          "0 0 20px rgba(43, 76, 126, 0.3), 0 0 40px rgba(43, 76, 126, 0.15)",
        "dark-card":
          "0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)",
        "dark-card-hover":
          "0 2px 8px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3)",
      },

      // -----------------------------------------------------------------------
      // Animations
      // -----------------------------------------------------------------------
      keyframes: {
        "brick-stack": {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.96)" },
          "60%": { opacity: "1", transform: "translateY(-4px) scale(1.01)" },
          "80%": { transform: "translateY(2px) scale(0.995)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "brick-fade-up": {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "counter-roll": {
          "0%": {
            opacity: "0",
            transform: "translateY(100%)",
            filter: "blur(4px)",
          },
          "50%": { opacity: "1", filter: "blur(0px)" },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0px)",
          },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gold-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 15px rgba(212, 168, 67, 0.2), 0 0 30px rgba(212, 168, 67, 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 25px rgba(212, 168, 67, 0.4), 0 0 50px rgba(212, 168, 67, 0.2)",
          },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-brick": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.06",
          },
          "25%": {
            transform: "translateY(-20px) rotate(2deg)",
            opacity: "0.1",
          },
          "50%": {
            transform: "translateY(-40px) rotate(-1deg)",
            opacity: "0.06",
          },
          "75%": {
            transform: "translateY(-20px) rotate(1deg)",
            opacity: "0.08",
          },
        },
        "float-brick-slow": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.04",
          },
          "50%": {
            transform: "translateY(-60px) rotate(-2deg)",
            opacity: "0.08",
          },
        },
        "float-brick-reverse": {
          "0%, 100%": {
            transform: "translateY(-30px) rotate(1deg)",
            opacity: "0.05",
          },
          "50%": {
            transform: "translateY(10px) rotate(-1deg)",
            opacity: "0.09",
          },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "brick-stack":
          "brick-stack 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "brick-fade-up":
          "brick-fade-up 0.6s cubic-bezier(0.0, 0.0, 0.2, 1) both",
        "counter-roll":
          "counter-roll 1.2s cubic-bezier(0.0, 0.0, 0.2, 1) both",
        "count-up": "count-up 0.8s ease-out forwards",
        "gold-glow": "gold-glow 2s ease-in-out infinite",
        "gold-shimmer": "gold-shimmer 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "float-brick": "float-brick 8s ease-in-out infinite",
        "float-brick-slow": "float-brick-slow 12s ease-in-out infinite",
        "float-brick-reverse": "float-brick-reverse 10s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "slide-up":
          "slide-up 0.3s cubic-bezier(0.0, 0.0, 0.2, 1) both",
        "slide-down":
          "slide-down 0.3s cubic-bezier(0.0, 0.0, 0.2, 1) both",
        "scale-in":
          "scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },

      // -----------------------------------------------------------------------
      // Background Image (gradients)
      // -----------------------------------------------------------------------
      backgroundImage: {
        "gold-shine":
          "linear-gradient(135deg, #D4A843 0%, #F3E4BA 50%, #D4A843 100%)",
        "dark-foundation":
          "linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 100%)",
        "brix-blueprint":
          "linear-gradient(135deg, #1A1A2E 0%, #2B4C7E 100%)",
        "brick-stack":
          "linear-gradient(180deg, #E8632B 0%, #D4A843 100%)",
      },

      // -----------------------------------------------------------------------
      // Transition timing functions
      // -----------------------------------------------------------------------
      transitionTimingFunction: {
        "brix-out": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        "brix-in": "cubic-bezier(0.4, 0.0, 1, 1)",
        "brix-in-out": "cubic-bezier(0.4, 0.0, 0.2, 1)",
        "brix-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
