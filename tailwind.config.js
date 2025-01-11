/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        440: "440px",
        362: "362px",
        56: "56px",
      },
      height: {
        956: "956px",
      },
      lineHeight: {
        '50': '50px',
      },
      // 스크롤바와 애니메이션을 위한 새로운 설정
      utilities: {
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      },
      keyframes: {
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [
  ],
};