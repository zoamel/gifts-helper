import React, { useState } from 'react'
import { Box, Container, Flex, Icon, IconButton } from '@chakra-ui/react'
import { MenuIcon, XIcon } from '@heroicons/react/solid'

type Props = {
  children: React.ReactNode
}

export const MainContainer = ({ children }: Props) => {
  const [isSidenavOpened, setIsSidenavOpened] = useState(false)

  function toggleSidenav() {
    setIsSidenavOpened((prevState) => !prevState)
  }

  return (
    <Box
      left={{ base: isSidenavOpened ? 'var(--sidebar-width)' : 0, lg: 0 }}
      marginInlineStart={{
        lg: 'var(--sidebar-width)',
      }}
      flex="1 1 0%"
      position="relative"
      transition="left 0.2s ease 0s"
      padding={{ base: 0, lg: 6 }}
      borderLeftWidth={{ base: 0, lg: '2px' }}
      borderLeftStyle="dashed"
      borderLeftColor="gray.400"
    >
      <Container
        borderRadius={{ base: 'initial', lg: 'lg' }}
        maxWidth="container.lg"
        height="full"
        bg="white"
        pt={8}
      >
        <Flex direction="column" height="full">
          <Box>
            <IconButton
              display={{ base: 'inline-block', lg: 'none' }}
              onClick={toggleSidenav}
              aria-label="menu button"
              icon={
                isSidenavOpened ? <Icon as={XIcon} /> : <Icon as={MenuIcon} />
              }
            />
          </Box>

          <Flex
            direction="column"
            flex="1 1 0%"
            overflow="auto"
            paddingInline={10}
          >
            {children}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
