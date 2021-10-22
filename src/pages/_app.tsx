import '@fontsource/raleway/400.css'
import '@fontsource/open-sans/600.css'
import '@fontsource/open-sans/700.css'

import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
