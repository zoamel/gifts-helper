import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LinkIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

import { WishlistItem } from '@/models/wishlist'

import giftImage from '../../../../public/images/giftbox.png'
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

  return (
    <Stack as="ul" direction="column" spacing={4}>
      {items.map((item) => (
        <HStack
          as="li"
          key={item.id}
          boxShadow="md"
          borderWidth="1px"
          borderColor="cyan.500"
          borderRadius="lg"
          px={4}
          py={2}
          bg="white"
          listStyleType="none"
          alignItems="flex-end"
          justifyContent="space-between"
          spacing={6}
        >
          <VStack alignItems="flex-start">
            <HStack alignItems="center" spacing={2}>
              <Image src={giftImage} width={20} height={20} alt="present" />
              <Text fontSize="xl">{item.name}</Text>
            </HStack>

            {item.description && (
              <Text fontSize="sm" color="gray.600">
                {item.description}
              </Text>
            )}
          </VStack>

          <HStack spacing={4}>
            {item.url && (
              <Link href={item.url} isExternal>
                <IconButton
                  aria-label={t('wishlist:urlButtonLabel')}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  icon={<Icon fontSize={20} as={LinkIcon} />}
                />
              </Link>
            )}

            <Button
              variant="outline"
              size="sm"
              colorScheme="cyan"
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
        </HStack>
      ))}

      <Skeleton height={16} isLoaded={!addingInProgress} borderRadius="lg" />

      {items.length === 0 && (
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
      )}
    </Stack>
  )
}
