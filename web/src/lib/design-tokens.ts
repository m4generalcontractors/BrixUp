/**
 * BrixUp Design Token System
 *
 * Single source of truth for all visual design primitives.
 * These tokens map directly to the brand guidelines and are consumed
 * by both the Tailwind theme (via CSS custom properties in globals.css)
 * and any runtime styling needs in components.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const colors = {
  // Primary
  charcoal: {
    50: "#E8E8EC",
    100: "#C5C5CF",
    200: "#9F9FAF",
    300: "#7A7A8F",
    400: "#5C5C72",
    500: "#3D3D55",
    600: "#2E2E44",
    700: "#1A1A2E", // Brand primary
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
    500: "#D4A843", // Brand primary
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
    500: "#4A4A5A", // Brand secondary
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
    500: "#2B4C7E", // Brand secondary
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
    400: "#E8632B", // Brand accent
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
    500: "#2ECC71", // Brand accent
    600: "#27B062",
    700: "#209452",
    800: "#197843",
    900: "#125C33",
    950: "#0B4024",
    DEFAULT: "#2ECC71",
  },

  // Backgrounds
  offwhite: "#F8F6F0",
  dark: "#0D0D1A",

  // Semantic aliases
  background: {
    light: "#F8F6F0",
    dark: "#0D0D1A",
  },
  foreground: {
    light: "#1A1A2E",
    dark: "#F8F6F0",
  },
} as const;

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

export const fonts = {
  heading: {
    family: "'Inter', system-ui, -apple-system, sans-serif",
    weights: {
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  body: {
    family: "'Space Grotesk', system-ui, -apple-system, sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
    },
  },
  code: {
    family: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    weights: {
      regular: 400,
      medium: 500,
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Typography Scale
// ---------------------------------------------------------------------------

export const typography = {
  display: {
    fontSize: "3rem", // 48px
    lineHeight: "3.5rem", // 56px
    fontFamily: fonts.heading.family,
    fontWeight: fonts.heading.weights.extrabold,
  },
  h1: {
    fontSize: "2.25rem", // 36px
    lineHeight: "2.75rem", // 44px
    fontFamily: fonts.heading.family,
    fontWeight: fonts.heading.weights.bold,
  },
  h2: {
    fontSize: "1.875rem", // 30px
    lineHeight: "2.375rem", // 38px
    fontFamily: fonts.heading.family,
    fontWeight: fonts.heading.weights.bold,
  },
  h3: {
    fontSize: "1.5rem", // 24px
    lineHeight: "2rem", // 32px
    fontFamily: fonts.heading.family,
    fontWeight: fonts.heading.weights.semibold,
  },
  h4: {
    fontSize: "1.25rem", // 20px
    lineHeight: "1.75rem", // 28px
    fontFamily: fonts.heading.family,
    fontWeight: fonts.heading.weights.semibold,
  },
  bodyLg: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.75rem", // 28px
    fontFamily: fonts.body.family,
    fontWeight: fonts.body.weights.regular,
  },
  body: {
    fontSize: "1rem", // 16px
    lineHeight: "1.5rem", // 24px
    fontFamily: fonts.body.family,
    fontWeight: fonts.body.weights.regular,
  },
  bodySm: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.25rem", // 20px
    fontFamily: fonts.body.family,
    fontWeight: fonts.body.weights.regular,
  },
  caption: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1rem", // 16px
    fontFamily: fonts.body.family,
    fontWeight: fonts.body.weights.regular,
  },
  code: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.25rem", // 20px
    fontFamily: fonts.code.family,
    fontWeight: fonts.code.weights.regular,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export const radii = {
  none: "0",
  sm: "4px",
  DEFAULT: "8px", // Buttons, inputs
  md: "8px",
  lg: "12px", // Cards
  xl: "16px",
  "2xl": "24px",
  full: "9999px", // Badges, avatars
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
  md: "0 2px 6px rgba(0, 0, 0, 0.08), 0 6px 16px rgba(0, 0, 0, 0.06)",
  lg: "0 2px 8px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)",
  xl: "0 4px 12px rgba(0, 0, 0, 0.15), 0 16px 40px rgba(0, 0, 0, 0.12)",
  "2xl": "0 8px 24px rgba(0, 0, 0, 0.2), 0 24px 60px rgba(0, 0, 0, 0.15)",
  inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",

  // Brand-specific shadows
  card: "0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
  cardHover: "0 2px 8px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)",
  goldGlow: "0 0 20px rgba(212, 168, 67, 0.3), 0 0 40px rgba(212, 168, 67, 0.15)",
  goldGlowStrong: "0 0 30px rgba(212, 168, 67, 0.5), 0 0 60px rgba(212, 168, 67, 0.25)",
  blueprintGlow: "0 0 20px rgba(43, 76, 126, 0.3), 0 0 40px rgba(43, 76, 126, 0.15)",

  // Dark mode shadows (more pronounced)
  darkCard: "0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)",
  darkCardHover: "0 2px 8px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3)",
} as const;

// ---------------------------------------------------------------------------
// Z-Index
// ---------------------------------------------------------------------------

export const zIndex = {
  behind: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
  tooltip: 70,
  max: 9999,
} as const;

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

export const transitions = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    DEFAULT: "200ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
  },
  easing: {
    easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0.0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ---------------------------------------------------------------------------
// Gradients (as CSS string values)
// ---------------------------------------------------------------------------

export const gradients = {
  goldShine:
    "linear-gradient(135deg, #D4A843 0%, #F3E4BA 50%, #D4A843 100%)",
  darkFoundation:
    "linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 100%)",
  blueprint:
    "linear-gradient(135deg, #1A1A2E 0%, #2B4C7E 100%)",
  brickStack:
    "linear-gradient(180deg, #E8632B 0%, #D4A843 100%)",
} as const;

// ---------------------------------------------------------------------------
// Consolidated theme export
// ---------------------------------------------------------------------------

export const theme = {
  colors,
  fonts,
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  gradients,
} as const;

export type BrixTheme = typeof theme;
export type BrixColors = typeof colors;
export type BrixShadows = typeof shadows;

export default theme;
