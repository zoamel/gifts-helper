import { useState } from 'react'

import {
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Link,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LinkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import { ListContainer, ListItem, MainLayout } from '@/components/ui'
import { ShoppingListItemStatus } from '@/models/wishlist'
import { ItemsService } from '@/services/items'
import { UsersService } from '@/services/user'

import giftImage from '../../../public/images/giftbox.png'
import { authOptions } from '../api/auth/[...nextauth]'

const UserDetails = () => {
  const { status, data: authUser } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const queryClient = useQueryClient()
  const { t } = useTranslation(['common', 'items'])
  const router = useRouter()
  const { id } = router.query

  const [itemInProgress, setItemInProgress] = useState<string | null>(null)

  const { data: user, isLoading } = useQuery(
    ['user', id],
    () => UsersService.getUser(id as string),
    {
      enabled: status === 'authenticated',
      onSettled() {
        setItemInProgress(null)
      },
    },
  )

  const followUserMutation = useMutation(
    () => UsersService.followUser(id as string),
    {
      onSuccess() {
        queryClient.invalidateQueries(['user', id])
      },
    },
  )

  const unfollowUserMutation = useMutation(
    () => UsersService.unfollowUser(id as string),
    {
      onSuccess() {
        queryClient.invalidateQueries(['user', id])
      },
    },
  )

  const updateItemStatusMutation = useMutation(
    (payload: { itemId: string; status: ShoppingListItemStatus }) =>
      ItemsService.changeItemStatus(payload.itemId, payload.status),
    {
      onMutate(data) {
        setItemInProgress(data.itemId)
      },
      onSuccess() {
        queryClient.invalidateQueries(['user', id])
      },
      onError() {
        setItemInProgress(null)
      },
    },
  )

  const removeItemFromShoppingListMutation = useMutation(
    (itemId: string) => ItemsService.removeItemFromShoppingList(itemId),
    {
      onMutate(data) {
        setItemInProgress(data)
      },
      onSuccess() {
        queryClient.invalidateQueries(['user', id])
      },
      onError() {
        setItemInProgress(null)
      },
    },
  )

  function handleFollowUser() {
    followUserMutation.mutate()
  }

  function handleUnfollowUser() {
    unfollowUserMutation.mutate()
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Progress isIndeterminate colorScheme="pink" size="xs" />
      </MainLayout>
    )
  }

  // @ts-ignore
  if (user?.isAuthUser) {
    return (
      <MainLayout>
        <Text>{t('items:youCannotViewYourOwnProfile')}</Text>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Box mb={6} pb={3} borderBottomWidth="2px" borderBottomStyle="dashed">
        <Breadcrumb fontWeight="medium" fontSize="md">
          <BreadcrumbItem>
            <NextLink href="/users-search" passHref>
              <BreadcrumbLink>{t('otherUsers')}</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{user?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      {user && (
        <>
          <HStack alignItems="center" spacing={3}>
            <Avatar name={user.name} src={user.image} />
            <Heading>{user.name}</Heading>
            <Box flex={1} />
            {user.isFollowedByAuthUser ? (
              <IconButton
                colorScheme="pink"
                icon={<AiFillEyeInvisible />}
                fontSize="24px"
                aria-label="unfollow this user"
                onClick={handleUnfollowUser}
                isLoading={unfollowUserMutation.isLoading}
              />
            ) : (
              <IconButton
                colorScheme="pink"
                icon={<AiFillEye />}
                fontSize="24px"
                aria-label="follow this user"
                onClick={handleFollowUser}
                isLoading={followUserMutation.isLoading}
              />
            )}
          </HStack>

          <Box my={8}>
            <ListContainer>
              {user.wishlist.items.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    background: () => {
                      if (item.isBought) {
                        return 'rgba(255, 0, 0, 0.1)'
                      }
                    },
                  }}
                >
                  <VStack alignItems="flex-start" width="full">
                    <HStack alignItems="center" spacing={2}>
                      <Image
                        src={giftImage}
                        width={20}
                        height={20}
                        alt="present"
                      />

                      <Text fontSize="xl">{item.name}</Text>

                      {item.isBoughtByAuthUser && (
                        <Badge colorScheme="green">
                          {t('items:boughtByYou')}
                        </Badge>
                      )}

                      {item.isBought && (
                        <Badge colorScheme="red">
                          {t('items:boughtBySomeone')}
                        </Badge>
                      )}
                    </HStack>

                    <Flex width="full">
                      <HStack spacing={4}>
                        {item.url && (
                          <Link href={item.url} isExternal>
                            <IconButton
                              aria-label="link to user"
                              colorScheme="blue"
                              variant="outline"
                              size="sm"
                              icon={<Icon fontSize={20} as={LinkIcon} />}
                            />
                          </Link>
                        )}

                        {item.description && (
                          <Text fontSize="sm" color="gray.600">
                            {item.description}
                          </Text>
                        )}
                      </HStack>

                      <Box flex={1} />

                      <Button
                        size="sm"
                        color="cyan.700"
                        disabled={item.isBought}
                        isLoading={itemInProgress === item.id}
                        onClick={() => {
                          !item.isBoughtByAuthUser
                            ? updateItemStatusMutation.mutate({
                                itemId: item.id!,
                                status: ShoppingListItemStatus.BOUGHT,
                              })
                            : removeItemFromShoppingListMutation.mutate(
                                item.id!,
                              )
                        }}
                      >
                        {item.isBoughtByAuthUser
                          ? t('items:markAsNotBought')
                          : t('items:markAsBought')}
                      </Button>
                    </Flex>
                  </VStack>
                </ListItem>
              ))}
            </ListContainer>
          </Box>
        </>
      )}
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  return {
    props: {
      session,
      ...(await serverSideTranslations(locale ?? 'pl', [
        'common',
        'forms',
        'users-search',
        'items',
      ])),
    },
  }
}

export default UserDetails
