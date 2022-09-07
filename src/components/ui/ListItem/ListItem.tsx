import React from 'react'

import { HStack, StackProps } from '@chakra-ui/react'

export const ListItem = ({ children, ...props }: StackProps) => {
  return (
    <HStack
      as="li"
      boxShadow="md"
      borderWidth="1px"
      borderColor="cyan.500"
      borderRadius="lg"
      px={4}
      py={2}
      bg="white"
      listStyleType="none"
      alignItems="flex-end"
      justifyContent="space-between"
      spacing={6}
      {...props}
    >
      {children}
    </HStack>
  )
}
