import React from 'react'
import { HStack } from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
}

export const ListItem = ({ children }: Props) => {
  return (
    <HStack
      as="li"
      boxShadow="md"
      borderWidth="1px"
      borderColor="teal.500"
      borderRadius="lg"
      px={4}
      py={2}
      bg="white"
      listStyleType="none"
      alignItems="flex-end"
      justifyContent="space-between"
      spacing={6}
    >
      {children}
    </HStack>
  )
}
