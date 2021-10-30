import { useState } from 'react'
import {
  Heading,
  Box,
  Text,
  HStack,
  VStack,
  Link,
  IconButton,
  Icon,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
} from '@chakra-ui/react'
import { GetServerSideProps, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useSession, getSession } from 'next-auth/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LinkIcon } from '@heroicons/react/outline'
import axios from 'axios'

import giftImage from '../../../public/images/giftbox.png'
import { MainLayout, ListContainer, ListItem } from '../../components/ui'
import { User } from '../../models/users'
import prisma from '../../lib/prisma'

type Props = {
  user: User
  currentUserId: string | null
}

const User = ({ user, currentUserId }: Props) => {
  const { t } = useTranslation(['common'])

  const { data: authUser, status } = useSession({
    required: true,
  })

  const [requestInProgress, setRequestInProgress] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>(user)

  if (!selectedUser) {
    return (
      <MainLayout>
        <Text color="red" size="lg">
          No User Found
        </Text>
      </MainLayout>
    )
  }

  const isAlreadyFollowing = !!selectedUser.followers?.find(
    (item) => item.followerId === currentUserId
  )

  const toggleFollow = async () => {
    if (isAlreadyFollowing) {
    } else {
      setRequestInProgress(true)
      try {
        const { data } = await axios.post<{
          followerId: string
          followingId: string
        }>('/api/following/create', {
          userToFollowId: selectedUser.id,
        })

        setSelectedUser((prevState) => {
          return {
            ...prevState,
            followers: [...prevState.followers, data],
          }
        })
        setRequestInProgress(false)
      } catch (error) {
        setRequestInProgress(false)
        console.error(error)
      }
    }
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
            <BreadcrumbLink>{selectedUser.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <HStack alignItems="center" spacing={3}>
        <Avatar name={selectedUser.name} src={selectedUser.image} />
        <Heading>{selectedUser.name}</Heading>
        <Box flex={1} />
        {status === 'authenticated' && (
          <Button
            variant="outline"
            colorScheme="teal"
            onClick={toggleFollow}
            disabled={isAlreadyFollowing}
            isLoading={requestInProgress}
          >
            {isAlreadyFollowing
              ? t('common:stopFollowing')
              : t('common:addToFollowed')}
          </Button>
        )}
      </HStack>

      <Box mt={8}>
        <ListContainer>
          {selectedUser.wishlists[0]?.items.map((item) => (
            <ListItem key={item.id}>
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
                      aria-label="link to user"
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      icon={<Icon fontSize={20} as={LinkIcon} />}
                    />
                  </Link>
                )}
              </HStack>
            </ListItem>
          ))}
        </ListContainer>
      </Box>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const userId = context.params?.id

  let currentUserId: string | null = null

  if (session?.user) {
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
      },
    })

    currentUserId = currentUser?.id ?? null
  }

  let foundUser = null

  if (userId) {
    foundUser = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
      include: {
        wishlists: {
          select: {
            id: true,
            name: true,
            items: {
              select: {
                id: true,
                name: true,
                description: true,
                url: true,
              },
            },
          },
        },
        followers: true,
      },
    })
  }

  return {
    props: {
      user: foundUser,
      currentUserId,
      ...(await serverSideTranslations(context.locale ?? 'pl', [
        'common',
        'forms',
        'users-search',
      ])),
    },
  }
}

export default User
