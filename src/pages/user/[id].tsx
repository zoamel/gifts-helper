import { useState } from 'react'

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Link,
  Progress,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LinkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { FollowButton } from '@/components/followers'
import { ListContainer, ListItem, MainLayout } from '@/components/ui'
import { ShoppingListItemStatus } from '@/models/wishlist'
import { ItemsService } from '@/services/items'
import { UsersService } from '@/services/user'

import giftImage from '../../../public/images/giftbox.png'

const UserDetails = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const t = useTranslations()
  const queryClient = useQueryClient()
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
        <Text>{t('Items.youCannotViewYourOwnProfile')}</Text>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* <Box mb={6} pb={3} borderBottomWidth="2px" borderBottomStyle="dashed">
        <Breadcrumb fontWeight="medium" fontSize="md">
          <BreadcrumbItem>
            <NextLink href="/users-search" passHref>
              {t('Common.goBack')}
            </NextLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box> */}

      {user && (
        <>
          <HStack alignItems="center" spacing={3}>
            <Avatar name={user.name} src={user.image} />
            <Heading>{user.name}</Heading>
            <Box flex={1} />

            <FollowButton
              followingStatus={user.followingStatus}
              isFollowedByAuthUser={user.isFollowedByAuthUser!}
              requestInProgress={
                followUserMutation.isLoading || unfollowUserMutation.isLoading
              }
              onFollowUser={handleFollowUser}
              onUnfollowUser={handleUnfollowUser}
              onCancelFollowRequest={() => {}}
            />
          </HStack>

          <Box my={8}>
            {user.wishlist.visibility === 'PRIVATE' &&
              user.followingStatus !== 'ACCEPTED' && (
                <Alert status="info">
                  <AlertIcon />
                  <AlertTitle>{t('Common.userWishlistIsPrivate')}</AlertTitle>
                </Alert>
              )}
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
                    <Stack
                      direction={['column', 'row']}
                      alignItems="center"
                      spacing={2}
                    >
                      <HStack spacing={2}>
                        <Image
                          src={giftImage}
                          width={20}
                          height={20}
                          alt="present"
                        />

                        <Text fontSize="xl">{item.name}</Text>
                      </HStack>

                      {item.isBoughtByAuthUser && (
                        <Badge colorScheme="green">
                          {t('Items.boughtByYou')}
                        </Badge>
                      )}

                      {item.isBought && (
                        <Badge colorScheme="red">
                          {t('Items.boughtBySomeone')}
                        </Badge>
                      )}
                    </Stack>

                    <Flex
                      width="full"
                      direction={['column', 'row']}
                      gap={[2, 0]}
                      pb={[2, 0]}
                    >
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
                          ? t('Items.markAsNotBought')
                          : t('Items.markAsBought')}
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  }
}

export default UserDetails
