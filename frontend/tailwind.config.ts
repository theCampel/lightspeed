import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Poppins', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				portfolio: {
					DEFAULT: '#222222',
					light: '#9F9EA1',
					dark: '#222222'
				},
				news: {
					DEFAULT: '#403E43',
					light: '#8A898C',
					dark: '#222222'
				},
				market: {
					DEFAULT: '#9F9EA1',
					light: '#F1F1F1',
					dark: '#403E43'
				},
				client: {
					DEFAULT: '#222222',
					light: '#C8C8C9',
					dark: '#222222'
				},
				question: {
					DEFAULT: '#403E43',
					light: '#E5DEFF',
					dark: '#222222'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					from: { opacity: '1', transform: 'translateY(0)' },
					to: { opacity: '0', transform: 'translateY(8px)' }
				},
				'timer-border': {
					from: { backgroundPosition: '0% 0%' },
					to: { backgroundPosition: '100% 0%' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-468px 0' },
					'100%': { backgroundPosition: '468px 0' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'gradient-x': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'ping-slow': {
					'75%, 100%': {
						transform: 'scale(1.5)',
						opacity: '0'
					}
				},
				'border-glow': {
					'0%, 100%': {
						'border-color': 'rgba(16, 185, 129, 0.2)'
					},
					'50%': {
						'border-color': 'rgba(16, 185, 129, 0.6)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-out': 'fade-out 0.4s ease-out',
				'timer-border': 'timer-border 30s linear forwards',
				'shimmer': 'shimmer 2.5s infinite linear',
				'scale-in': 'scale-in 0.3s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'gradient-x': 'gradient-x 15s ease infinite',
				'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
				'border-glow': 'border-glow 3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'dark-gradient': 'linear-gradient(135deg, #222222 0%, #403E43 100%)',
				'dark-soft': 'linear-gradient(135deg, rgba(34, 34, 34, 0.1) 0%, rgba(64, 62, 67, 0.1) 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

