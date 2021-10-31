import React from 'react'
import { Box, VStack, Button, Flex } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'

import { MENU_ITEMS } from './constants'
import { MenuLink } from './MenuLink'
import { AppLogo } from './AppLogo'

export const SideNav = () => {
  const { t } = useTranslation('common')

  const { data: sessionData, status } = useSession()

  return (
    <Flex
      display="block"
      as="nav"
      flex="1 1 0%"
      left={0}
      py={5}
      px={3}
      position="fixed"
      color="gray.200"
      minHeight="full"
      sx={{
        width: 'var(--sidebar-width)',
      }}
    >
      <AppLogo />

      <Flex overflowY="auto" minHeight="full" pt={5} pb={6} direction="column">
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

            <Button
              width="full"
              variant="outline"
              colorScheme="white"
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
    </Flex>
  )
}
