/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,ts,svelte}'],
	theme: {

		colors: {
			primary: 'rgb(var(--color-primary) / <alpha-value>)',
			secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
			theme: 'rgb(var(--color-theme) / <alpha-value>)',
			contrast: 'rgb(var(--color-contrast) / <alpha-value>)',
			'contrast-primary': 'rgb(var(--color-contrast-primary) / <alpha-value>)',
			'contrast-secondary': 'rgb(var(--color-contrast-secondary) / <alpha-value>)',
			highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
			subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
			confirm: 'rgb(var(--color-confirm) / <alpha-value>)',
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
			strokeWidth: {
				3: '3px'
			},
			animation: {
				'peek': 'peek 0.6s ease-out forwards',
				'peeked': 'peeked 0.8s ease-out forwards'
			},
			keyframes: {
				'peek': {
					'0%': {
						opacity: '0',
						scale: '1'
					},
					'40%': {
						opacity: '1'
					},
					'50%': {
						opacity: '1',
						scale: '1.6'
					},
					'90%': {
						opacity: '0.5',
						scale: '1.8'
					},
					'100%': {
						opacity: '0',
						scale: '1.8'
					}
				},
				'peeked': {
					'0%': {
						opacity: '1'
					},
					'20%': {
						opacity: '0'
					},
					'70%': {
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

