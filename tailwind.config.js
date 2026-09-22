/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* Dark theme palette */
        "dt-accent": "#00f3ff",
        "dt-accent-glow": "rgba(0, 243, 255, 0.3)",
        "dt-bg": "#0a0a0a",
        "dt-card": "#111111",
        "dt-surface": "#1a1a1a",
        "dt-border": "#2a2a2a",
        "dt-text": "#888888",
        "dt-muted": "#555555",

        /* Light theme palette */
        "lt-accent": "#0d9488",
        "lt-accent-glow": "rgba(13, 148, 136, 0.3)",
        "lt-bg": "#f8f5f0",
        "lt-card": "#f0ece5",
        "lt-surface": "#e8e4dc",
        "lt-border": "#d4d0c8",
        "lt-text": "#5a5a5a",
        "lt-muted": "#8a8a8a",
        "lt-dark": "#1a1a1a",
      },
      fontFamily: {
        trajan: ["Cinzel", "'Trajan Pro'", "'Times New Roman'", "serif"],
        helvetica: ["'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "phi-xs": "0.375rem",   /* 6px */
        "phi-sm": "0.625rem",   /* 10px */
        "phi-md": "1rem",       /* 16px */
        "phi-lg": "1.625rem",   /* 26px */
        "phi-xl": "2.625rem",   /* 42px */
        "phi-2xl": "4.25rem",   /* 68px */
        "phi-3xl": "6.875rem",  /* 110px */
      },
      fontSize: {
        "phi-xs": "0.625rem",   /* 10px */
        "phi-sm": "0.75rem",    /* 12px */
        "phi-base": "1rem",     /* 16px */
        "phi-md": "1.25rem",    /* 20px */
        "phi-lg": "1.625rem",   /* 26px */
        "phi-xl": "2.625rem",   /* 42px */
        "phi-2xl": "4.25rem",   /* 68px */
        "phi-3xl": "6.875rem",  /* 110px */
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 243, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 243, 255, 0.6)" },
        },
        "spin-3d": {
          from: { transform: "rotateY(0deg) rotateX(10deg)" },
          to: { transform: "rotateY(360deg) rotateX(10deg)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-3d": "spin-3d 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
