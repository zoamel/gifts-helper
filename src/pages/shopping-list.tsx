import type { GetStaticProps, NextPage } from 'next'
import { Heading } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { MainLayout } from '../components/ui'

const ShoppingList: NextPage = () => {
  return (
    <MainLayout>
      <Heading>My Shopping List</Heading>
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

export default ShoppingList
