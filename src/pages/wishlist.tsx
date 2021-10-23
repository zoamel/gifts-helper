import type { NextPage } from 'next'
import { Heading } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession, signIn } from 'next-auth/react'

import { MainLayout } from '../components/ui'

const Wishlist: NextPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  return (
    <MainLayout>
      <Heading>My Wishlist</Heading>
    </MainLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pl', ['common'])),
    },
  }
}

export default Wishlist
