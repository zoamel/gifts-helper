import React from 'react'
import { Stack, StackProps } from '@chakra-ui/react'

export const ListContainer = ({
  children,
  spacing = 4,
  ...props
}: StackProps) => {
  return (
    <Stack as="ul" direction="column" spacing={spacing} {...props}>
      {children}
    </Stack>
  )
}
