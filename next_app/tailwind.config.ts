import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    safelist: ['animate-[fade-in_1s_ease-in-out]', 'animate-[fade-in-down_1s_ease-in-out]'],
    extend: {
     
      keyframes: {

       

        opacity: {
          "0%": {
            opacity: "0%",
            visibility: "hidden"
          },
          "100%": {
            opacity: "100%"
          }  
        },

        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }  
        },

        masking: {
        
          "0%": {
           
            width: "0%",
            height: "0%",
            visibility: "hidden",
            delay: "7sec"
          },
          "100%": {
            width: "100%",
           height: "100%"
          }  
        },



        blink: {
          
          "50%": {
            borderColor: "transparent"
          },
          "100%": {
            borderColor: "white"
          }  
        },
      
      enter: {
        "0%": {
          opacity: "0%",
          bgcolor: "white"
        },
        "100%": {
          opacity: "100%",
          bgcolor: "white"
        },          
       
      }
    },

      animation: {
        enter: "enter 1s 1s" ,
        typing: "typing 1s  steps(20)  alternate, blink .7s infinite, enter " ,
        masking: "masking 3s 1s both  "
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
export default config
