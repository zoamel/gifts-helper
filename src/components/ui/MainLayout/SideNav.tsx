import React from 'react'
import { Box, VStack, Button, Flex, Text } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'

import { MENU_ITEMS } from './constants'
import { MenuLink } from './MenuLink'
import { AppLogo } from './AppLogo'

export const SideNav = () => {
  const { t } = useTranslation('common')

  const { data: sessionData, status } = useSession()

  return (
    <Box
      display="block"
      flex="1 1 0%"
      width="var(--sidebar-width)"
      left={0}
      py={5}
      px={3}
      position="fixed"
      height="full"
      color="gray.200"
    >
      <VStack alignItems="flex-start" height="full">
        <AppLogo />

        <Flex
          overflowY="auto"
          pt={5}
          pb={6}
          direction="column"
          width="full"
          height="full"
        >
          {sessionData?.user ? (
            <>
              <VStack pb={6} alignItems="stretch" spacing={4}>
                {MENU_ITEMS.map((menuItem) => (
                  <MenuLink
                    key={menuItem.label}
                    href={menuItem.href}
                    label={menuItem.label}
                    icon={menuItem.icon}
                  />
                ))}
              </VStack>

              <Box flex={1} />

              <Text fontSize="lg" pb={4}>
                {sessionData.user.name}
              </Text>

              <Button
                width="full"
                variant="outline"
                colorScheme="white"
                size="md"
                isLoading={status === 'loading'}
                onClick={() => {
                  signOut()
                }}
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Box flex={1} />

              <Button
                width="full"
                variant="outline"
                colorScheme="white"
                isLoading={status === 'loading'}
                onClick={() => {
                  signIn()
                }}
              >
                {t('login')}
              </Button>
            </>
          )}
        </Flex>
      </VStack>
    </Box>
  )
}
