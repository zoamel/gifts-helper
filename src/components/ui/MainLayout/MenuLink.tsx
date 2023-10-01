import React from 'react'

import { HStack, Icon, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'

type Props = {
  href: string
  label: string
  icon: any
}

export const MenuLink = ({ href, label, icon }: Props) => {
  const router = useRouter()
  const isActive = router.pathname === href

  const t = useTranslations('Common')

  return (
    <Link
      as={NextLink}
      href={href}
      mr={2}
      fontSize="sm"
      px={3}
      py={2}
      borderRadius="md"
      cursor="pointer"
      fontWeight="medium"
      transition="background 0.1s ease-out 0s;"
      textDecoration="none"
      width="100%"
      bg={isActive ? 'cyan.700' : 'inherit'}
      color={isActive ? 'white' : 'black'}
      _hover={{
        color: 'white',
        bg: 'cyan.700',
      }}
    >
      <HStack alignItems="center">
        <Icon h={4} w={4} as={icon} color="inherit" />
        <Text fontSize="md" color="inherit">
          {/* @ts-ignore */}
          {t(label)}
        </Text>
      </HStack>
    </Link>
  )
}
