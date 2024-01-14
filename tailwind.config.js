import themes from "daisyui/src/theming/themes";

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
          ...themes.light,
					primary: '#b8d4cc',
					secondary: '#48ab82',
					accent: '#45aeba',
					neutral: '#f2f2f2',
					'base-100': '#ffffff',
          'neutral-content': 'black',
				},
			},
		],
	},
};
