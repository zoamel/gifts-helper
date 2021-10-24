import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Heading, Divider, Skeleton, Text, Box } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession, signIn } from 'next-auth/react'
import axios from 'axios'

import { MainLayout } from '../components/ui'
import { AddNewItem, ItemsList } from '../components/wishlist'
import { Wishlist, WishlistItem } from '../models/wishlist'

const WishlistPage: NextPage = () => {
  const [wishlistId, setWishlistId] = useState<string | null>(null)
  const [wishlistTitle, setWishlistTitle] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [fetchingInProgress, setFetchingInProgress] = useState<boolean>(true)
  const [addingItemInProgress, setAddingItemInProgress] = useState(false)
  const [fetchingError, setFetchingError] = useState<string | null>(null)

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  useEffect(() => {
    if (session?.user) {
      fetchWishlist()
    }
  }, [session])

  async function createDefaultWishlist() {
    try {
      const payload: Pick<Wishlist, 'name'> = {
        name: 'List do św. Mikołaja',
      }

      const { data: createdWishlist } = await axios.post<Wishlist>(
        '/api/wishlist',
        payload
      )

      setWishlistTitle(createdWishlist.name)
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

      setWishlistTitle(data.name)
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
    } catch (error) {
      setAddingItemInProgress(false)
      console.error(error)
    }
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
    <MainLayout>
      <Skeleton isLoaded={fetchingInProgress === false}>
        <Heading size="lg" color="blackAlpha.600">
          {wishlistTitle}
        </Heading>
      </Skeleton>

      {wishlistId && (
        <AddNewItem onAddNewItem={(item) => handleAddNewItem(item)} />
      )}

      <Divider colorScheme="red" my={6} />

      <Box>
        <Skeleton isLoaded={fetchingInProgress === false}>
          <ItemsList
            items={wishlistItems}
            addingInProgress={addingItemInProgress}
          />
        </Skeleton>
      </Box>
    </MainLayout>
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
