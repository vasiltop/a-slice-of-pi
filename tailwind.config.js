/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					primary: '#b8d4cc',
					secondary: '#48ab82',
					accent: '#45aeba',
					neutral: '#ffffff',
					'base-100': '#f2f2f2',
				},
			},

		],
	},
};
