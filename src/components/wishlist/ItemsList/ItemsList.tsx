import {
  Stack,
  Flex,
  Text,
  Skeleton,
  IconButton,
  Icon,
  HStack,
  Button,
  VStack,
  Box,
} from '@chakra-ui/react'
import { TrashIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import { WishlistItem } from '../../../models/wishlist'
import emptyStateImg from '../../../../public/images/no_data.svg'

type Props = {
  items: WishlistItem[]
  addingInProgress: boolean
  onSelectItem: (item: WishlistItem) => void
  onDeleteItem: (item: WishlistItem) => void
}

export const ItemsList = ({
  items,
  addingInProgress,
  onSelectItem,
  onDeleteItem,
}: Props) => {
  const { t } = useTranslation(['common', 'wishlist'])

  if (items.length === 0) {
    return (
      <VStack spacing={8}>
        <Text color="blackAlpha.700" fontSize="xl">
          Nie masz jeszcze przedmiotow na swojej liscie
        </Text>
        <Box>
          <Image
            src={emptyStateImg}
            alt="Empty State"
            width={300}
            height={300}
          />
        </Box>
      </VStack>
    )
  }

  return (
    <Stack as="ul" direction="column" spacing={4}>
      {items.map((item) => (
        <Flex
          as="li"
          key={item.id}
          boxShadow="md"
          borderWidth="1px"
          borderColor="teal.500"
          borderRadius="lg"
          height={16}
          px={4}
          bg="white"
          listStyleType="none"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="xl">{item.name}</Text>

          <HStack spacing={4}>
            <Button
              variant="outline"
              size="sm"
              colorScheme="teal"
              onClick={() => onSelectItem(item)}
            >
              {t('wishlist:itemEditLabel')}
            </Button>

            <IconButton
              aria-label={t('wishlist:deleteItemButtonLabel')}
              colorScheme="red"
              variant="outline"
              size="sm"
              icon={<Icon fontSize={20} as={TrashIcon} />}
              onClick={() => onDeleteItem(item)}
            />
          </HStack>
        </Flex>
      ))}
      <Skeleton height={16} isLoaded={!addingInProgress} borderRadius="lg" />
    </Stack>
  )
}
