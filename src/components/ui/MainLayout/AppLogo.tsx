import React from 'react'

import { Circle, HStack, Icon, Text } from '@chakra-ui/react'
import { GiftIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'next-i18next'

export const AppLogo = () => {
  const { t } = useTranslation()

  return (
    <HStack alignItems="center" spacing={3} p={3}>
      <Circle size="36px" bg="cyan.700" color="white">
        <Icon as={GiftIcon} w={5} h={5} />
      </Circle>
      <Text fontSize="xl">{t('common:appName')}</Text>
    </HStack>
  )
}
