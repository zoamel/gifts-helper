import { Stack, Flex, Text, Skeleton } from '@chakra-ui/react'

import { WishlistItem } from '../../../models/wishlist'

type Props = {
  items: WishlistItem[]
  addingInProgress: boolean
}

export const ItemsList = ({ items, addingInProgress }: Props) => {
  return (
    <Stack as="ul" direction="column" spacing={4}>
      {items.map((item) => (
        <Flex
          as="li"
          key={item.id}
          boxShadow="md"
          borderRadius="lg"
          height={16}
          px={2}
          bg="gray.100"
          cursor="pointer"
          listStyleType="none"
          alignItems="center"
          transition="all .2s ease-in-out"
          _hover={{
            transform: 'scale(1.01)',
            bg: 'gray.200',
          }}
        >
          <Text fontSize="xl">{item.name}</Text>
        </Flex>
      ))}
      <Skeleton height={16} isLoaded={!addingInProgress} borderRadius="lg" />
    </Stack>
  )
}
