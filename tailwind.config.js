/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#0f0f1a',
        'game-surface': '#1a1a2e',
        'game-border': '#2d2d44',
        'game-accent': '#667eea',
        'game-accent-hover': '#7c8ff4',
        'game-success': '#48bb78',
        'game-error': '#f56565',
        'game-warning': '#ed8936',
        'game-text': '#e2e8f0',
        'game-text-dim': '#718096',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
