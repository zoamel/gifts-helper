import type { NextPage } from 'next'
import { Heading } from '@chakra-ui/react'

import { MainLayout } from '../components/ui'

const ShoppingList: NextPage = () => {
  return (
    <MainLayout>
      <Heading>My Shopping List</Heading>
    </MainLayout>
  )
}

export default ShoppingList
