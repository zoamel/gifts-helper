import { useRef, useState } from 'react'

import {
  Box,
  Divider,
  Progress,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

import { MainLayout } from '@/components/ui'
import {
  AddNewItem,
  DeleteItemConfirmation,
  ItemDetailsModal,
  ItemsList,
} from '@/components/wishlist'
import prisma from '@/lib/prisma'
import { WishlistItem } from '@/models/wishlist'

import { authOptions } from './api/auth/[...nextauth]'

type Props = {
  initialItems: WishlistItem[]
}

const WishlistPage: NextPage<Props> = ({ initialItems }) => {
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

  const { data: items, isError } = useQuery(
    ['wishlistItems'],
    async () => {
      const { data } = await axios.get<WishlistItem[]>('/api/wishlist')
      return data
    },
    {
      initialData: initialItems,
    },
  )

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

          {items && (
            <ItemsList
              items={items}
              onSelectItem={(item) => {
                setSelectedItem(item)
                onOpenEditModal()
              }}
              onDeleteItem={onInitializeDeleteItem}
            />
          )}
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
  resolvedUrl,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent(
          req.headers.host + resolvedUrl,
        )}`,
        permanent: false,
      },
    }
  }

  if (session?.user?.email) {
    const items = await prisma.item.findMany({
      where: {
        wishlist: {
          owner: {
            email: session.user.email,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
      },
    })

    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'pl', [
          'common',
          'wishlist',
          'forms',
        ])),
        initialItems: items,
      },
    }
  } else {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'pl', [
          'common',
          'wishlist',
          'forms',
        ])),
        initialItems: [],
      },
    }
  }
}

export default WishlistPage
