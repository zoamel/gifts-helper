import React from 'react'
import { Circle, HStack, Icon, Text } from '@chakra-ui/react'
import { GiftIcon } from '@heroicons/react/outline'

export const AppLogo = () => {
  return (
    <HStack alignItems="center" justifyContent="center" spacing={3} p={3}>
      <Circle size="36px" bg="cyan.900" color="white">
        <Icon as={GiftIcon} w={5} h={5} />
      </Circle>
      <Text fontSize="2xl">Gifts Helper</Text>
    </HStack>
  )
}
