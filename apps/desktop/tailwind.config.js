/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Couleurs de base
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",

        // Couleurs primaires
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          50: "rgb(var(--primary-50))",
          100: "rgb(var(--primary-100))",
          200: "rgb(var(--primary-200))",
          300: "rgb(var(--primary-300))",
          400: "rgb(var(--primary-400))",
          500: "rgb(var(--primary-500))",
          600: "rgb(var(--primary-600))",
          700: "rgb(var(--primary-700))",
          800: "rgb(var(--primary-800))",
          900: "rgb(var(--primary-900))",
        },

        // Couleurs secondaires
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
          50: "rgb(var(--secondary-50))",
          100: "rgb(var(--secondary-100))",
          200: "rgb(var(--secondary-200))",
          300: "rgb(var(--secondary-300))",
          400: "rgb(var(--secondary-400))",
          500: "rgb(var(--secondary-500))",
          600: "rgb(var(--secondary-600))",
          700: "rgb(var(--secondary-700))",
          800: "rgb(var(--secondary-800))",
          900: "rgb(var(--secondary-900))",
        },

        // Couleurs d'accent
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
          50: "rgb(var(--accent-50))",
          100: "rgb(var(--accent-100))",
          200: "rgb(var(--accent-200))",
          300: "rgb(var(--accent-300))",
          400: "rgb(var(--accent-400))",
          500: "rgb(var(--accent-500))",
          600: "rgb(var(--accent-600))",
          700: "rgb(var(--accent-700))",
          800: "rgb(var(--accent-800))",
          900: "rgb(var(--accent-900))",
        },

        // Couleurs de succès
        success: {
          DEFAULT: "rgb(var(--success))",
          foreground: "rgb(var(--success-foreground))",
          50: "rgb(var(--success-50))",
          100: "rgb(var(--success-100))",
          200: "rgb(var(--success-200))",
          300: "rgb(var(--success-300))",
          400: "rgb(var(--success-400))",
          500: "rgb(var(--success-500))",
          600: "rgb(var(--success-600))",
          700: "rgb(var(--success-700))",
          800: "rgb(var(--success-800))",
          900: "rgb(var(--success-900))",
        },

        // Couleurs d'avertissement
        warning: {
          DEFAULT: "rgb(var(--warning))",
          foreground: "rgb(var(--warning-foreground))",
          50: "rgb(var(--warning-50))",
          100: "rgb(var(--warning-100))",
          200: "rgb(var(--warning-200))",
          300: "rgb(var(--warning-300))",
          400: "rgb(var(--warning-400))",
          500: "rgb(var(--warning-500))",
          600: "rgb(var(--warning-600))",
          700: "rgb(var(--warning-700))",
          800: "rgb(var(--warning-800))",
          900: "rgb(var(--warning-900))",
        },

        // Couleurs d'erreur/destructive
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
          50: "rgb(var(--destructive-50))",
          100: "rgb(var(--destructive-100))",
          200: "rgb(var(--destructive-200))",
          300: "rgb(var(--destructive-300))",
          400: "rgb(var(--destructive-400))",
          500: "rgb(var(--destructive-500))",
          600: "rgb(var(--destructive-600))",
          700: "rgb(var(--destructive-700))",
          800: "rgb(var(--destructive-800))",
          900: "rgb(var(--destructive-900))",
        },

        // Couleurs neutres
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },

        // Couleurs pour les cartes et popovers
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },

        // Couleurs spécifiques à l'application
        brand: {
          DEFAULT: "rgb(var(--brand))",
          foreground: "rgb(var(--brand-foreground))",
          50: "rgb(var(--brand-50))",
          100: "rgb(var(--brand-100))",
          200: "rgb(var(--brand-200))",
          300: "rgb(var(--brand-300))",
          400: "rgb(var(--brand-400))",
          500: "rgb(var(--brand-500))",
          600: "rgb(var(--brand-600))",
          700: "rgb(var(--brand-700))",
          800: "rgb(var(--brand-800))",
          900: "rgb(var(--brand-900))",
        },

        // Couleurs pour les personnages
        character: {
          red: "rgb(var(--character-red))",
          blue: "rgb(var(--character-blue))",
          green: "rgb(var(--character-green))",
          purple: "rgb(var(--character-purple))",
          yellow: "rgb(var(--character-yellow))",
          pink: "rgb(var(--character-pink))",
          indigo: "rgb(var(--character-indigo))",
          gray: "rgb(var(--character-gray))",
          amber: "rgb(var(--character-amber))",
          orange: "rgb(var(--character-orange))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
