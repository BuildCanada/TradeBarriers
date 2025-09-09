import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Founders Grotesk Mono"', "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", "monospace"],
        mono: ['"Founders Grotesk Mono"', "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", "monospace"],
        founders: ['"Founders Grotesk Mono"', "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Bloomberg-style color scheme
        "bloomberg-dark": "#1a1a1a",
        "bloomberg-blue": "#1e90ff",
        "bloomberg-red": "#dc143c",
        "bloomberg-gray": "#404040",
        "bloomberg-border": "#666666",
        "bloomberg-text": "#ffffff",
        "bloomberg-navy": "#1e3a8a",
      },
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        DEFAULT: "0",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      safelist: [
        // Status colors from getStatusColor function
        "bg-gray-100", "text-gray-800", "border-gray-300",
        "bg-blue-100", "text-blue-800", "border-blue-300",
        "bg-yellow-100", "text-yellow-800", "border-yellow-300",
        "bg-orange-100", "text-orange-800", "border-orange-300",
        "bg-green-100", "text-green-800", "border-green-300",

        // Government status colors from getGovernmentStatusColor function
        "bg-gray-50", "text-gray-600", "text-gray-700", "border-gray-200",
        "bg-blue-50", "text-blue-700", "border-blue-200",
        "bg-yellow-50", "text-yellow-700", "border-yellow-200",
        "bg-purple-50", "text-purple-700", "border-purple-200",
        "bg-green-50", "text-green-700", "border-green-200",
        "bg-orange-50", "text-orange-700", "border-orange-200",
        "bg-red-50", "text-red-700", "border-red-200",
      ],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
