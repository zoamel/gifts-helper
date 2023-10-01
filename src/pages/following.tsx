import { Box, Progress, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { MainLayout } from '@/components/ui'
import { UsersList } from '@/components/users-search'
import { UsersService } from '@/services/user'

import { authOptions } from './api/auth/[...nextauth]'

const Following: NextPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const { t } = useTranslation(['common', 'users'])

  const {
    data: users,
    fetchStatus,
    isError,
  } = useQuery(['following'], () => UsersService.getUsersFollowedByMe(), {
    enabled: status === 'authenticated',
  })

  return (
    <MainLayout>
      {fetchStatus === 'fetching' && (
        <Progress isIndeterminate colorScheme="pink" size="xs" my={1} />
      )}

      {isError && (
        <Box my={4}>
          <Text color="red">{t('common:requestError')}</Text>
        </Box>
      )}

      {users ? <UsersList users={users} /> : null}

      {users && users.length === 0 && (
        <Text size="2xl" textAlign="center">
          {t('users:notFollowingAnyone')}
        </Text>
      )}
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const session = await getServerSession(req, res, authOptions)

  return {
    props: {
      session,
      ...(await serverSideTranslations(locale ?? 'pl', ['common', 'users'])),
    },
  }
}

export default Following
