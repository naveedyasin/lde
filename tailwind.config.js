/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	  "./src/**/*.{html,ts}",
  ],
	theme: {
		extend: {
			colors: {
				primary: '#203960',
				aqua: {
					DEFAULT: '#EDF7C1'
				},
				blue: {
					'200': '#425D86',
					'300': '#203960'
				},
				gray: {
					'50': '#F8FAFC',
					'100': '#F1F5F9',
					'200': '#E2E8F0',
					'300': '#CBD5E1',
					'600': '#475569',
					'700': '#334155',
				},
				apple_green: {
					DEFAULT: '#D9FFCC',
				},
				green: {
					DEFAULT: '#008064',
					'300': '#007A60'
				},
				lime_green: {
					DEFAULT: '#EDF7C1',
					'200': '#EDF7C1',
					'300': '#E7F5AE',
				},
				sea_grean: {
					DEFAULT: '#E1FFDE',
				},
				yellow: {
					DEFAULT: '#FCFD8B',
				},
				pink: {
					DEFAULT: '#F7EDE1',
				},
				red: {
					DEFAULT: '#DF0000',
				}
			},
			fontFamily: {
				'space-grotesk': 'Space Grotesk',
				'arima-koshi': 'Arima',
			},
			screens: {
				'xl': '1280px',
				'2xl': '1280px',
			},
			
		},
	},
  plugins: [],
}

