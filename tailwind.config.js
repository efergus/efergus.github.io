const defaultTheme = require('tailwindcss/defaultTheme')

const colors = ['primary', 'secondary', 'theme', 'contrast', 'contrast-primary', 'contrast-secondary', 'highlight', 'subtle', 'confirm', 'pop'];

const colorDefinitions = Object.fromEntries(colors.map(color=>[color, `rgb(var(--color-${color}) / <alpha-value>)`]))

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,ts,svelte}'],
	theme: {

		colors: {
			...colorDefinitions,
			white: '#ffffff',
			black: '#000000',
      		transparent: '#00000000'
		},

		fontSize: {
			sm: ['.875rem', '1.25rem'],
			base: ['1.125rem', '1.75rem'],
			lg: ['1.25rem', '1.75rem'],
			xl: ['1.5rem', '2rem'],
			'2xl': ['2rem', '2.5rem'],
			'3xl': ['2.5rem', '3.2rem']
		},
		extend: {
			fontFamily: {
				sans: ['Lato', ...defaultTheme.fontFamily.sans],
				header: ['"Noto Sans"', 'Lato', ...defaultTheme.fontFamily.sans],
				serif: ['"Playfair Display"', ...defaultTheme.fontFamily.serif]
			},
			strokeWidth: {
				3: '3px'
			},
			animation: {
				'peek': 'peek 0.6s ease-out forwards',
				'peeked': 'peeked 0.6s ease-out forwards'
			},
			keyframes: {
				'peek': {
					'0%': {
						opacity: '0'
					},
					'10%': {
						opacity: '1'
					},
					'90%': {
						opacity: '1'
					},
					'100%': {
						opacity: '0'
					}
				},
				'peeked': {
					'0%': {
						opacity: '1'
					},
					'10%': {
						opacity: '0'
					},
					'90%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				}
			}
		}
	},
	plugins: []
}

