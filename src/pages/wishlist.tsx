import { useRef, useState } from 'react'

import { Box, Divider, Text, useDisclosure, useToast } from '@chakra-ui/react'
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

import { MainLayout } from '@/components/ui'
import {
  AddNewItem,
  DeleteItemConfirmation,
  ItemDetailsModal,
  ItemsList,
} from '@/components/wishlist'
import { WishlistItem } from '@/models/wishlist'
import { WishlistService } from '@/services/wishlist'

import { authOptions } from './api/auth/[...nextauth]'

const WishlistPage: NextPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const toast = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common', 'wishlist'])
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
  } = useQuery(['wishlistItems'], WishlistService.getWishlistItems, {
    enabled: status === 'authenticated',
  })

  const addItemMutation = useMutation(
    (payload: WishlistItem) =>
      axios.post<WishlistItem>('/api/wishlist/add-item', payload),
    {
      onError: (error) => {
        console.error(error)

        toast({
          status: 'error',
          title: t('wishlist:requestErrorMessage'),
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries(['wishlistItems'])
      },
    },
  )

  const updateItemMutation = useMutation(
    (payload: WishlistItem) => {
      const { id, ...item } = payload
      return axios.patch<WishlistItem>(`/api/items/${id}`, item)
    },
    {
      onSuccess: () => {
        setSelectedItem(null)
        onCloseEditModal()
        queryClient.invalidateQueries(['wishlistItems'])

        toast({
          status: 'success',
          title: t('wishlist:itemUpdateSuccessMessage'),
          colorScheme: 'cyan',
        })
      },
      onError: (error) => {
        let message = ''

        if (axios.isAxiosError(error)) {
          message = error.message
        } else {
          message = t('wishlist:requestErrorMessage')
        }

        toast({
          status: 'error',
          title: message,
        })
      },
    },
  )

  const deleteItemMutation = useMutation(
    (id: string) => axios.delete(`/api/items/${id}`),
    {
      onSuccess() {
        setSelectedItem(null)
        setIsConfirmDeleteOpen(false)
        queryClient.invalidateQueries(['wishlistItems'])

        toast({
          status: 'info',
          title: t('wishlist:itemDeleteSuccessMessage'),
          colorScheme: 'cyan',
        })
      },
      onError(error) {
        let message = ''

        if (axios.isAxiosError(error)) {
          message = error.message
        } else {
          message = t('wishlist:requestErrorMessage')
        }

        toast({
          status: 'error',
          title: message,
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
          {t('wishlist:requestErrorMessage')}
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
        <Box>
          <Divider colorScheme="red" my={6} />

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
  const queryClient = new QueryClient()

  const session = await unstable_getServerSession(req, res, authOptions)

  if (session) {
    await queryClient.prefetchQuery(
      ['wishlistItems'],
      WishlistService.getWishlistItems,
    )
  }

  return {
    props: {
      session,
      ...(await serverSideTranslations(locale ?? 'pl', [
        'common',
        'wishlist',
        'forms',
      ])),
    },
  }
}

export default WishlistPage
