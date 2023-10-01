import { extendTheme } from '@chakra-ui/react'
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
})

const fonts = {
  heading: openSans.style.fontFamily,
  body: openSans.style.fontFamily,
}

const theme = extendTheme({
  fonts,
  styles: {
    global: {
      '.js-focus-visible :focus:not([data-focus-visible-added])': {
        outline: 'none',
        boxShadow: 'none',
      },
    },
  },
  components: {
    Text: {
      baseStyle: {
        color: 'black',
      },
    },
  },
})

export default theme
