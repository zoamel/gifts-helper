import { useState, useEffect } from 'react'
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
  Progress,
} from '@chakra-ui/react'
import { GetServerSideProps, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useSession, getSession } from 'next-auth/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { LinkIcon } from '@heroicons/react/outline'
import axios from 'axios'

import giftImage from '../../../public/images/giftbox.png'
import { MainLayout, ListContainer, ListItem } from '../../components/ui'
import { User } from '../../models/users'

const User = () => {
  const router = useRouter()
  const { id } = router.query

  const { t } = useTranslation(['common'])

  const { data: authUser, status } = useSession({
    required: true,
  })

  const [requestInProgress, setRequestInProgress] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    setRequestInProgress(true)

    axios
      .get<User>(`/api/users/${id}`)
      .then(({ data }) => {
        setSelectedUser(data)
        setRequestInProgress(false)
      })
      .catch((error) => {
        console.error(error)
        setRequestInProgress(false)
      })
  }, [id])

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
            <BreadcrumbLink>{selectedUser?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      {requestInProgress && (
        <Progress isIndeterminate colorScheme="teal" size="xs" />
      )}

      {selectedUser && (
        <>
          <HStack alignItems="center" spacing={3}>
            <Avatar name={selectedUser.name} src={selectedUser.image} />
            <Heading>{selectedUser.name}</Heading>
            <Box flex={1} />
          </HStack>

          <Box mt={8}>
            <ListContainer>
              {selectedUser.wishlists[0]?.items.map((item) => (
                <ListItem key={item.id}>
                  <VStack alignItems="flex-start">
                    <HStack alignItems="center" spacing={2}>
                      <Image
                        src={giftImage}
                        width={20}
                        height={20}
                        alt="present"
                      />
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
        </>
      )}
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'pl', [
        'common',
        'forms',
        'users-search',
      ])),
    },
  }
}

export default User
