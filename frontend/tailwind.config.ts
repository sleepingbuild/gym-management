import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './services/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — cam giống IronFit MVC (gym-accent -> gym-accent2)
        primary: {
          DEFAULT: '#FF6B00',
          active: '#e65f00',
          disabled: '#3a2a1f',
        },
        // Surfaces — dark theme
        canvas: '#0f1117',            // nền tổng thể (gym-dark)
        surface: {
          card: '#1a1d27',            // nền card (gym-card)
          soft: '#161822',            // nền phụ, gần canvas hơn card
          dark: '#0a0b10',            // nền tối nhất, dùng cho sidebar (gym-darker)
          'dark-elevated': '#20232f', // hover / active state (gym-card-hover)
          'dark-soft': '#12151e',     // nền input (gym-input)
          'cream-strong': '#2a2d3a',  // giữ tên cũ để khỏi vỡ chỗ đang dùng, giá trị = border
        },
        // Text
        ink: '#e2e8f0',
        body: {
          DEFAULT: '#a8afbd',
          strong: '#e2e8f0',
        },
        muted: {
          DEFAULT: '#64748b',
          soft: '#4b5566',
        },
        // Viền — token mới, trước đây "hairline" được dùng trong code nhưng
        // chưa từng được khai báo trong config (class border-hairline không có tác dụng)
        hairline: '#2a2d3a',
        // Semantic
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        accent: {
          teal: '#7c3aed',   // tím info (gym-info)
          amber: '#FF8C38',  // cam sáng (gym-accent2)
        },
        // On colors
        on: {
          primary: '#ffffff',
          dark: '#e2e8f0',
          'dark-soft': '#64748b',
        },
      },
      fontFamily: {
        // Bỏ font serif, dùng Inter cho toàn bộ giống MVC
        display: ['Inter', '-apple-system', 'sans-serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
        code: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['64px', { lineHeight: '1.05', letterSpacing: '-1.5px', fontWeight: '800' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-1px', fontWeight: '800' }],
        'display-md': ['36px', { lineHeight: '1.15', letterSpacing: '-0.5px', fontWeight: '800' }],
        'display-sm': ['28px', { lineHeight: '1.2', letterSpacing: '-0.3px', fontWeight: '800' }],
        'title-lg': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'title-md': ['18px', { lineHeight: '1.4', fontWeight: '700' }],
        'title-sm': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.55', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.55', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'caption-uppercase': ['12px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '1px' }],
        code: ['14px', { lineHeight: '1.6' }],
        button: ['14px', { lineHeight: '1', fontWeight: '600' }],
      },
      spacing: {
        section: '96px',
      },
      borderRadius: {
        sm: '8px',
        md: '8px',
        lg: '14px',
        xl: '18px',
        pill: '9999px',
      },
      boxShadow: {
        glow: '0 4px 16px rgba(255, 107, 0, 0.25)',
        'glow-lg': '0 6px 24px rgba(255, 107, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;