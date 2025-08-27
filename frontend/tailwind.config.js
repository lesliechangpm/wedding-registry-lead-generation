/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Navy - Primary
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e3a5f',
          950: '#102a43',
        },
        // Rose Gold - Secondary  
        'rose-gold': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#e8b4a0',
          600: '#db7093',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // Sage Green - Accent
        sage: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bbe5bb',
          300: '#9caf88',
          400: '#7a9a6e',
          500: '#5a7c5a',
          600: '#456745',
          700: '#385438',
          800: '#2d422d',
          900: '#243624',
        },
        // Warm Gray - Neutral
        'warm-gray': {
          50: '#f5f5f5',
          100: '#efefef',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3d3d3d',
        },
        // Success - Forest Green
        forest: {
          500: '#2d5a3d',
          600: '#1f4529',
          700: '#143319',
        },
        // Warning - Amber
        amber: {
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Error - Burgundy
        burgundy: {
          500: '#991b1b',
          600: '#7f1d1d',
          700: '#6b1717',
        },
      },
      fontFamily: {
        // Headers - Inter/Poppins (modern sans-serif)
        'header': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        // Body - Open Sans/Source Sans Pro (readable, professional)
        'body': ['Open Sans', 'Source Sans Pro', 'system-ui', 'sans-serif'],
        // Accent/Script - Playfair Display (elegant serif for wedding touches)
        'accent': ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'wedding': '4px',
        'wedding-lg': '8px',
      },
      boxShadow: {
        'wedding': '0 1px 3px 0 rgba(30, 58, 95, 0.1), 0 1px 2px 0 rgba(30, 58, 95, 0.06)',
        'wedding-lg': '0 4px 6px -1px rgba(30, 58, 95, 0.1), 0 2px 4px -1px rgba(30, 58, 95, 0.06)',
        'wedding-xl': '0 10px 15px -3px rgba(30, 58, 95, 0.1), 0 4px 6px -2px rgba(30, 58, 95, 0.05)',
      },
    },
  },
  plugins: [],
}