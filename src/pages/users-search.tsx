import { useState } from 'react'

import { Box, Progress, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { MainLayout } from '@/components/ui'
import { UsersList, UsersSearchForm } from '@/components/users-search'
import { UsersService } from '@/services/user'

import { authOptions } from './api/auth/[...nextauth]'

const UsersSearch: NextPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const { t } = useTranslation()

  const [query, setQuery] = useState('')

  const {
    data: users,
    fetchStatus,
    isError,
  } = useQuery(['usersSearch', query], () => UsersService.search(query), {
    enabled: status === 'authenticated' && query.length > 0,
  })

  return (
    <MainLayout>
      <UsersSearchForm
        onSearch={(query) => {
          setQuery(query)
        }}
        requestInProgress={fetchStatus === 'fetching'}
      />

      {fetchStatus === 'fetching' && (
        <Progress isIndeterminate colorScheme="pink" size="xs" my={1} />
      )}

      {isError && (
        <Box my={4}>
          <Text color="red">{t('common:requestError')}</Text>
        </Box>
      )}

      {users ? <UsersList users={users} /> : null}
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
      ...(await serverSideTranslations(locale ?? 'pl', [
        'common',
        'forms',
        'users-search',
      ])),
    },
  }
}

export default UsersSearch
