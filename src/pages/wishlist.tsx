import type { NextPage } from 'next'
import { Heading } from '@chakra-ui/react'

import { MainLayout } from '../components/ui'

const Wishlist: NextPage = () => {
  return (
    <MainLayout>
      <Heading>My Wishlist</Heading>
    </MainLayout>
  )
}

export default Wishlist
