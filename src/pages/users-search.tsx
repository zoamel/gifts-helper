import type { NextPage } from 'next'
import { Heading } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { MainLayout } from '../components/ui'

const UsersSearch: NextPage = () => {
  return (
    <MainLayout>
      <Heading>Users Search</Heading>
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

export default UsersSearch
