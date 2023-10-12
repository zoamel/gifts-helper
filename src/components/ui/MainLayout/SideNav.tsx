import React from 'react'

import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { useGetPendingFriendsInvites } from '@/hooks/useGetPendingFriendsInvites'

import { AppLogo } from './AppLogo'
import { MenuLink } from './MenuLink'
import { MENU_ITEMS } from './constants'

export const SideNav = () => {
  const t = useTranslations('Common')

  const { data: sessionData, status } = useSession()

  const { data } = useGetPendingFriendsInvites()

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
                {MENU_ITEMS.filter((item) => {
                  if (item.label === 'pendingInvites') {
                    return data && data.length > 0
                  }

                  return true
                }).map((menuItem) => (
                  <MenuLink
                    key={menuItem.label}
                    href={menuItem.href}
                    label={menuItem.label}
                    icon={menuItem.icon}
                    isNotification={data && data.length > 0}
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
                color="black"
                borderColor="cyan.700"
                size="md"
                isLoading={status !== 'authenticated'}
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
                color="black"
                borderColor="cyan.700"
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
