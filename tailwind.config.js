/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core Backgrounds
        background: '#121317',
        surface: '#121317',
        'surface-container-lowest': '#0d0e12',
        'surface-container-low': '#1a1b1f',
        'surface-container': '#1e1f23',
        'surface-container-high': '#292a2e',
        'surface-container-highest': '#343539',
        
        // Text & Foreground
        'on-background': '#e3e2e7',
        'on-surface': '#e3e2e7',
        'on-surface-variant': '#e8bcba', // Muted
        
        // Accents (Apple Red mapped to primary-container)
        primary: '#ffb3b0',
        'on-primary': '#68000f',
        'primary-container': '#ff5357',
        'on-primary-container': '#5c000c',
        
        // Secondary Elements
        secondary: '#c8c6c8',
        'on-secondary': '#303032',
        'secondary-container': '#474649',
        'on-secondary-container': '#b6b4b7',
        
        // Borders
        outline: '#ae8785',
        'outline-variant': '#5e3f3d',
      },
      spacing: {
        'sidebar-width': '260px',
        'player-height': '88px',
        'margin-safe': '32px',
        'gutter': '24px'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}