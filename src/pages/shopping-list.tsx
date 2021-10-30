import type { GetStaticProps, NextPage } from 'next'
import { Heading, Box, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import { MainLayout } from '../components/ui'
import underConstructionImage from '../../public/images/under_construction.svg'

const ShoppingList: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <MainLayout>
      <VStack pt={4} spacing={6}>
        <Heading size="lg" color="gray.600">
          {t('comingSoon')}
        </Heading>

        <Box>
          <Image src={underConstructionImage} alt="" width={400} height={300} />
        </Box>
      </VStack>
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
