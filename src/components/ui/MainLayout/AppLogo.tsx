import React from 'react'

import { Circle, HStack, Icon, Text } from '@chakra-ui/react'
import { GiftIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

export const AppLogo = () => {
  const t = useTranslations('Common')

  return (
    <HStack alignItems="center" spacing={3} p={3}>
      <Circle size="36px" bg="cyan.700" color="white">
        <Icon as={GiftIcon} w={5} h={5} />
      </Circle>
      <Text fontSize="xl">{t('appName')}</Text>
    </HStack>
  )
}
