import React from 'react'

import { Flex } from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
}
export const LayoutContainer = ({ children }: Props) => {
  return (
    <Flex
      height="100vh"
      background="gray.100"
      overflow="hidden"
      sx={{ '--sidebar-width': '16rem' }}
    >
      {children}
    </Flex>
  )
}
