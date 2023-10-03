import { useState } from 'react'

import { Box, Progress, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

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

  const t = useTranslations()

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
          <Text color="red">{t('Common.requestError')}</Text>
        </Box>
      )}

      {users?.length === 0 && (
        <Box my={4}>
          <Text>{t('UsersSearch.noResults')}</Text>
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
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}

export default UsersSearch
