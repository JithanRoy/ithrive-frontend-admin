/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', '!./node_modules/**'],
    corePlugins: { preflight: false },
    theme: {
        fontFamily: {
            poppins: ['Poppins'],
        },
        extend: {
            maxWidth: {
                980: '980px',
                1160: '1160px',
                1320: '1320px',
            },
            colors: {
                primary: {
                    DEFAULT: 'rgba(220, 96, 37, 1)',
                    2: 'rgba(255, 135, 67, 0.12)',
                },
                secondary: {
                    DEFAULT: 'rgba(27, 17, 184, 1)',
                    2: 'radial-gradient(46.92% 46.92% at 50% 50%, rgba(27, 17, 184, 0.75) 0%, #1B11B8 100%)',
                    3: 'rgba(27, 17, 184, 0.12)',
                },
                red: {
                    DEFAULT: 'rgba(197, 44, 40, 1)',
                },
                vanilla: {
                    DEFAULT: 'rgba(177, 173, 109, 1)',
                },
                olivine: {
                    DEFAULT: 'rgba(166, 0, 193, 1)',
                },
                black: {
                    DEFAULT: 'rgba(0, 0, 0, 1)',
                },
                redOliV: {
                    DEFAULT: 'rgba(177, 173, 109, 1)',
                    2: 'rgba(197, 44, 40, 1)',
                },
                gray: {
                    DEFAULT: 'rgba(51, 51, 51, 1)',
                },
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
        },
    },
    plugins: [],
};
