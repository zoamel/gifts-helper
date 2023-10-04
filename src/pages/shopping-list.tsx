import { Box, Heading, VStack } from '@chakra-ui/react'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import underConstructionImage from '../../public/images/under_construction.svg'
import { MainLayout } from '../components/ui'

const ShoppingList: NextPage = () => {
  const t = useTranslations()

  return (
    <MainLayout>
      <VStack pt={4} spacing={6}>
        <Heading size="lg" color="gray.600">
          {t('Common.comingSoon')}
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
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}

export default ShoppingList
