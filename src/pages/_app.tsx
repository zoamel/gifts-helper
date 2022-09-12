import React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/open-sans/600.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/raleway/400.css'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import 'focus-visible/dist/focus-visible'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'

import theme from '../theme'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(MyApp)
