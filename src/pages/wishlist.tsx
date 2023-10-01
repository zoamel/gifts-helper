import { useRef, useState } from 'react'

import { Box, Divider, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { MainLayout } from '@/components/ui'
import {
  AddNewItem,
  DeleteItemConfirmation,
  ItemDetailsModal,
  ItemsList,
} from '@/components/wishlist'
import { wishlistKeys } from '@/constants/queryKeys'
import { WishlistItem } from '@/models/wishlist'
import { WishlistService } from '@/services/wishlist'

import { authOptions } from './api/auth/[...nextauth]'

const WishlistPage: NextPage = () => {
  useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const toast = useToast()
  const queryClient = useQueryClient()
  const t = useTranslations()

  const {
    isOpen: editModalOpened,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure()
  const deleteRef = useRef(null)

  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const {
    data: items,
    isLoading: loadingItems,
    isError,
  } = useQuery({
    queryKey: wishlistKeys.allWishlistItems,
    queryFn: WishlistService.getWishlistItems,
  })

  const addItemMutation = useMutation(
    (payload: WishlistItem) => WishlistService.addNewWishlistItem(payload),
    {
      onError: (error) => {
        console.error(error)

        toast({
          status: 'error',
          title: t('Wishlist.requestErrorMessage'),
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: wishlistKeys.allWishlistItems,
        })
      },
    },
  )

  const updateItemMutation = useMutation(
    (payload: WishlistItem) => WishlistService.updateItem(payload),
    {
      onSuccess: () => {
        setSelectedItem(null)
        onCloseEditModal()
        queryClient.invalidateQueries(wishlistKeys.allWishlistItems)

        toast({
          status: 'success',
          title: t('Wishlist.itemUpdateSuccessMessage'),
          colorScheme: 'cyan',
        })
      },
      onError: () => {
        toast({
          status: 'error',
          title: t('Wishlist.requestErrorMessage'),
        })
      },
    },
  )

  const deleteItemMutation = useMutation(
    (id: string) => WishlistService.deleteWishlistItem(id),
    {
      onSuccess() {
        setSelectedItem(null)
        setIsConfirmDeleteOpen(false)
        queryClient.invalidateQueries(wishlistKeys.allWishlistItems)

        toast({
          status: 'info',
          title: t('Wishlist.itemDeleteSuccessMessage'),
          colorScheme: 'cyan',
        })
      },
      onError(error) {
        toast({
          status: 'error',
          title: t('Wishlist.requestErrorMessage'),
        })

        setIsConfirmDeleteOpen(false)
        setSelectedItem(null)
      },
    },
  )

  function handleItemDelete() {
    if (!selectedItem) {
      return
    }

    const { id } = selectedItem

    deleteItemMutation.mutate(id!)
  }

  const onInitializeDeleteItem = (item: WishlistItem) => {
    setSelectedItem(item)
    setIsConfirmDeleteOpen(true)
  }

  const onCancelDeleteItem = () => {
    setSelectedItem(null)
    setIsConfirmDeleteOpen(false)
  }

  if (isError) {
    return (
      <MainLayout>
        <Text colorScheme="red" textAlign="center">
          {t('Wishlist.requestErrorMessage')}
        </Text>
      </MainLayout>
    )
  }

  return (
    <>
      <MainLayout
        staticTopElement={
          <AddNewItem
            requestInProgress={addItemMutation.isLoading}
            onAddNewItem={(item) => {
              addItemMutation.mutate(item)
            }}
          />
        }
      >
        <Box py={6}>
          <Divider />

          <ItemsList
            items={items}
            loadingItems={loadingItems}
            onSelectItem={(item) => {
              setSelectedItem(item)
              onOpenEditModal()
            }}
            onDeleteItem={onInitializeDeleteItem}
          />
        </Box>
      </MainLayout>

      <DeleteItemConfirmation
        ref={deleteRef}
        onCancel={onCancelDeleteItem}
        onConfirm={handleItemDelete}
        isOpened={isConfirmDeleteOpen}
      />

      <ItemDetailsModal
        isOpened={editModalOpened}
        saveInProgress={updateItemMutation.isLoading}
        onClose={onCloseEditModal}
        onSave={(item) => updateItemMutation.mutate(item)}
        item={selectedItem}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  return {
    props: {
      session: await getServerSession(req, res, authOptions),
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}

export default WishlistPage
