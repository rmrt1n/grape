/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				display: ['Clash Display', 'system-ui', 'sans-serif']
			}
		}
	},

	plugins: []
};

module.exports = config;
