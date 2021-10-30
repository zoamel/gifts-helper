import type { NextPage } from 'next'
import { useEffect, useState, useRef } from 'react'
import {
  Divider,
  Text,
  Box,
  Progress,
  Container,
  HStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession, signIn } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

import { MainLayout } from '../components/ui'
import {
  AddNewItem,
  ItemsList,
  ItemDetailsModal,
  DeleteItemConfirmation,
} from '../components/wishlist'
import { Wishlist, WishlistItem } from '../models/wishlist'

const WishlistPage: NextPage = () => {
  const {
    isOpen: editModalOpened,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure()

  const toast = useToast()

  const { t } = useTranslation(['common', 'wishlist'])

  const deleteRef = useRef(null)

  const [wishlistId, setWishlistId] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const [fetchingInProgress, setFetchingInProgress] = useState<boolean>(true)
  const [addingItemInProgress, setAddingItemInProgress] = useState(false)
  const [updatedInProgress, setUpdateInProgress] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  const [fetchingError, setFetchingError] = useState<string | null>(null)

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  async function createDefaultWishlist() {
    try {
      const payload: Pick<Wishlist, 'name'> = {
        name: 'List do św. Mikołaja',
      }

      const { data: createdWishlist } = await axios.post<Wishlist>(
        '/api/wishlist',
        payload
      )

      setWishlistId(createdWishlist.id)
      setFetchingInProgress(false)
      setFetchingError(null)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFetchingError(error.message)
        setFetchingInProgress(false)
      } else {
        setFetchingError('Something went wrong')
        setFetchingInProgress(false)
      }
    }
  }

  async function fetchWishlist() {
    setFetchingInProgress(true)

    try {
      const { data } = await axios.get<Wishlist>('/api/wishlist')

      setWishlistItems(data.items)
      setWishlistId(data.id)
      setFetchingInProgress(false)
      setFetchingError(null)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          createDefaultWishlist()
        } else {
          setFetchingError(error.message)
          setFetchingInProgress(false)
        }
      } else {
        setFetchingError('Something went wrong')
        setFetchingInProgress(false)
      }
    }
  }

  async function handleAddNewItem(item: WishlistItem) {
    const payload = {
      item,
      wishlistId,
    }

    setAddingItemInProgress(true)
    try {
      const { data } = await axios.post<Wishlist>(
        '/api/wishlist/add-item',
        payload
      )

      setWishlistItems(data.items)
      setAddingItemInProgress(false)
      toast({
        status: 'success',
        title: t('wishlist:itemAddSuccessMessage'),
      })
    } catch (error) {
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

      setAddingItemInProgress(false)
    }
  }

  async function handleItemEditSave(item: WishlistItem) {
    const { id, ...payload } = item

    setUpdateInProgress(true)

    try {
      const { data } = await axios.patch<WishlistItem>(
        `/api/items/${id}`,
        payload
      )

      setWishlistItems((items) => {
        const index = items.findIndex((item) => item.id === data.id)

        items[index] = {
          id: data.id,
          name: data.name,
          url: data.url,
          description: data.description,
        }

        return items
      })

      setSelectedItem(null)
      setUpdateInProgress(false)

      onCloseEditModal()

      toast({
        status: 'success',
        title: t('wishlist:itemUpdateSuccessMessage'),
      })
    } catch (error) {
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

      setUpdateInProgress(false)
    }
  }

  async function handleItemDelete() {
    if (!selectedItem) {
      return
    }

    const { id } = selectedItem

    setDeleteInProgress(true)

    try {
      await axios.delete(`/api/items/${id}`)

      setWishlistItems((items) => items.filter((item) => item.id !== id))

      setSelectedItem(null)
      setDeleteInProgress(false)
      setIsConfirmDeleteOpen(false)

      toast({
        status: 'info',
        title: t('wishlist:itemDeleteSuccessMessage'),
      })
    } catch (error) {
      let message = ''

      if (axios.isAxiosError(error)) {
        message = error.message
      } else {
        message = t('wishlist:requestErrorMessage')
      }

      setIsConfirmDeleteOpen(false)

      toast({
        status: 'error',
        title: message,
      })

      setSelectedItem(null)
      setDeleteInProgress(false)
    }
  }

  const onInitializeDeleteItem = (item: WishlistItem) => {
    setSelectedItem(item)
    setIsConfirmDeleteOpen(true)
  }

  const onCancelDeleteItem = () => {
    setSelectedItem(null)
    setIsConfirmDeleteOpen(false)
  }

  if (fetchingError) {
    return (
      <MainLayout>
        <Text colorScheme="red" textAlign="center">
          {fetchingError}
        </Text>
      </MainLayout>
    )
  }

  return (
    <>
      <MainLayout>
        <AddNewItem
          requestInProgress={fetchingInProgress === true}
          onAddNewItem={(item) => handleAddNewItem(item)}
        />

        <Box>
          <Divider colorScheme="red" my={6} />

          {fetchingInProgress && (
            <Progress isIndeterminate colorScheme="teal" size="xs" my={2} />
          )}

          {!fetchingInProgress && (
            <ItemsList
              items={wishlistItems}
              addingInProgress={addingItemInProgress}
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
        saveInProgress={updatedInProgress}
        onClose={onCloseEditModal}
        onSave={handleItemEditSave}
        item={selectedItem}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pl', [
        'common',
        'wishlist',
        'forms',
      ])),
    },
  }
}

export default WishlistPage
