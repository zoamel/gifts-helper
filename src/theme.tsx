import { extendTheme } from '@chakra-ui/react'

const fonts = { heading: 'Open Sans', body: 'Open Sans' }

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
