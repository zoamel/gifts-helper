import '@fontsource/raleway/400.css'
import '@fontsource/open-sans/600.css'
import '@fontsource/open-sans/700.css'

import 'focus-visible/dist/focus-visible'

import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { appWithTranslation } from 'next-i18next'

import theme from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default appWithTranslation(MyApp)
