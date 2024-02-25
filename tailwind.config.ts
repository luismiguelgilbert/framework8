import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
export default <Partial<Config>>{
  // content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'DM Sans fallback', ...defaultTheme.fontFamily.sans]
      },
      // colors: {
      //   bitt: {
      //     50: '#fafafa',
      //     100: '#e4e4e7',
      //     200: '#4A4A4A',
      //     300: '#363636',
      //     400: '#212121',
      //     // 400: '#a1a1aa',
      //     500: '#0D0D0D',
      //     600: '#000000',
      //     700: '#000000',
      //     800: '#000000',
      //     900: '#000000'

      //     // 50: '#5C5C5C',
      //     // 100: '#525252',
      //     // 200: '#3D3D3D',
      //     // 300: '#292929',
      //     // 400: '#141414',
      //     // 500: '#000000',
      //     // 600: '#000000',
      //     // 700: '#000000',
      //     // 800: '#000000',
      //     // 900: '#000000'
      //   },
      // }
    },
  },
  // plugins: [],
}

