import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import type { AppProps } from 'next/app'

import theme from '../theme'

const queryClient = new QueryClient()

type PageProps = {
  messages: IntlMessages
  session: Session
}

type Props = Omit<AppProps<PageProps>, 'pageProps'> & {
  pageProps: PageProps
}

export default function MyApp({ Component, pageProps }: Props) {
  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </SessionProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
