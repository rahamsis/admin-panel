import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        
      },
      backgroundImage: {
        // para depsac
        'depsac-banner-right': "url('/depsac/assets/dots-light.svg')",
      },
      colors: {
          primary: '#1F1F1F',
          secondary: "#696969",
          Gray: "#f0f0f0",
          sidebar: "#3b3b3f",
          sidebarDark: "#252529",
      },
    },
    screens: {
      "xxs": "280px",
      "xs": "320px",
      "ss": "480px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "x": "1216px",
      "xl": "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};

export default config