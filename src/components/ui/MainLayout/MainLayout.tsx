import Head from 'next/head'
import {
  Flex,
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Icon,
  Link,
  Circle,
} from '@chakra-ui/react'
import {
  GiftIcon,
  ClipboardListIcon,
  ViewListIcon,
  SearchIcon,
} from '@heroicons/react/outline'

type Props = {
  children: React.ReactNode
}

export const MainLayout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Gifts Helper</title>
        <meta
          name="description"
          content="App that helps with christmas gifts shopping"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#234e52" />
        <meta name="msapplication-TileColor" content="#234e52" />
        <meta name="theme-color" content="#234e52" />
      </Head>
      <Flex
        height="100vh"
        background="cyan.800"
        overflow="hidden"
        sx={{ '--sidebar-width': '16rem' }}
      >
        <Box
          display="block"
          as="nav"
          flex="1 1 0%"
          left={0}
          py={5}
          px={3}
          position="fixed"
          color="gray.200"
          sx={{
            width: 'var(--sidebar-width)',
          }}
        >
          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={3}
            p={3}
            transition="background 0.1s ease 0s"
            borderRadius="xl"
            cursor="pointer"
            _hover={{
              bg: 'whiteAlpha.200',
            }}
          >
            <Circle size="36px" bg="cyan.900" color="white">
              <Icon as={GiftIcon} w={5} h={5} />
            </Circle>
            <Text fontSize="2xl">Gifts Helper</Text>
          </HStack>
          <Box
            overflowY="auto"
            height="80vh"
            minHeight="px"
            maxHeight="full"
            pt={5}
            pb={6}
          >
            <VStack pb={6} alignItems="stretch" spacing={4}>
              <Link
                mr={2}
                fontSize="sm"
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                fontWeight="medium"
                transition="background 0.1s ease-out 0s;"
                textDecoration="none"
                bg="cyan.700"
                _hover={{
                  color: 'white',
                  bg: 'cyan.700',
                }}
              >
                <HStack alignItems="center">
                  <Icon h={4} w={4} as={ClipboardListIcon} />
                  <Text fontSize="md">My Wishlist</Text>
                </HStack>
              </Link>

              <Link
                mr={2}
                fontSize="sm"
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                fontWeight="medium"
                transition="background 0.1s ease-out 0s;"
                textDecoration="none"
                _hover={{
                  color: 'white',
                  bg: 'cyan.700',
                }}
              >
                <HStack alignItems="center">
                  <Icon h={4} w={4} as={ViewListIcon} />
                  <Text fontSize="md">My Shopping List</Text>
                </HStack>
              </Link>

              <Link
                mr={2}
                fontSize="sm"
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                fontWeight="medium"
                transition="background 0.1s ease-out 0s;"
                textDecoration="none"
                _hover={{
                  color: 'white',
                  bg: 'cyan.700',
                }}
              >
                <HStack alignItems="center">
                  <Icon h={4} w={4} as={SearchIcon} />
                  <Text fontSize="md">Other Users</Text>
                </HStack>
              </Link>
            </VStack>
          </Box>
        </Box>
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
      </Flex>
    </>
  )
}
