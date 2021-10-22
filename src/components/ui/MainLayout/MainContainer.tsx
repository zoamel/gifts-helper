import React from 'react'
import { Box, Container, Flex } from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
}

export const MainContainer = ({ children }: Props) => {
  return (
    <Box
      p={6}
      flex="1 1 0%"
      position="relative"
      left={0}
      transition="left 0.2s ease 0s"
      borderLeftWidth="2px"
      borderLeftStyle="dashed"
      borderLeftColor="gray.400"
      sx={{
        marginInlineStart: 'var(--sidebar-width)',
      }}
    >
      <Container
        borderRadius="lg"
        maxWidth="container.xl"
        bg="gray.200"
        height="100%"
        pb={6}
      >
        <Flex direction="column" height="full">
          {children}
        </Flex>
      </Container>
    </Box>
  )
}
