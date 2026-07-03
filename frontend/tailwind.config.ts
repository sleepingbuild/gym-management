import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: '#cc785c',
          active: '#a9583e',
          disabled: '#e6dfd8',
        },
        // Surfaces
        canvas: '#faf9f5',
        surface: {
          card: '#efe9de',
          soft: '#f5f0e8',
          dark: '#181715',
          'dark-elevated': '#252320',
          'dark-soft': '#1f1e1b',
          'cream-strong': '#e8e0d2',
        },
        // Text
        ink: '#141413',
        body: {
          DEFAULT: '#3d3d3a',
          strong: '#252523',
        },
        muted: {
          DEFAULT: '#6c6a64',
          soft: '#8e8b82',
        },
        // Semantic
        success: '#5db872',
        warning: '#d4a017',
        error: '#c64545',
        accent: {
          teal: '#5db8a6',
          amber: '#e8a55a',
        },
        // On colors
        on: {
          primary: '#ffffff',
          dark: '#faf9f5',
          'dark-soft': '#a09d96',
        },
      },
      fontFamily: {
        display: ['Copernicus', 'Tiempos Headline', 'Cormorant Garamond', 'serif'],
        body: ['StyreneB', 'Inter', '-apple-system', 'sans-serif'],
        code: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['64px', { lineHeight: '1.05', letterSpacing: '-1.5px' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-1px' }],
        'display-md': ['36px', { lineHeight: '1.15', letterSpacing: '-0.5px' }],
        'display-sm': ['28px', { lineHeight: '1.2', letterSpacing: '-0.3px' }],
        'title-lg': ['22px', { lineHeight: '1.3', fontWeight: '500' }],
        'title-md': ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        'title-sm': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-md': ['16px', { lineHeight: '1.55', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.55', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'caption-uppercase': ['12px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '1.5px' }],
        code: ['14px', { lineHeight: '1.6', fontFamily: 'JetBrains Mono, monospace' }],
        button: ['14px', { lineHeight: '1', fontWeight: '500' }],
      },
      spacing: {
        'section': '96px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
};

export default config;