import React from 'react'
import { Box, VStack } from '@chakra-ui/react'

import { MENU_ITEMS } from './constats'
import { MenuLink } from './MenuLink'
import { AppLogo } from './AppLogo'

export const SideNav = () => {
  return (
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
      <AppLogo />

      <Box
        overflowY="auto"
        height="80vh"
        minHeight="px"
        maxHeight="full"
        pt={5}
        pb={6}
      >
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
      </Box>
    </Box>
  )
}