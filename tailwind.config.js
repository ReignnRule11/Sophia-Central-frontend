export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0b1020',
        panel: '#111827',
        accent: '#7c3aed',
        mint: '#34d399',
        sky: '#38bdf8',
        gold: '#fbbf24'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124, 58, 237, 0.25), 0 18px 40px rgba(15, 23, 42, 0.4)'
      }
    }
  },
  plugins: []
};
