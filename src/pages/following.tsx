import { Box, Progress, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps, NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { MainLayout } from '@/components/ui'
import { UsersList } from '@/components/users-search'
import { UsersService } from '@/services/user'

const Following: NextPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const t = useTranslations()

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
          <Text color="red">{t('Common.requestError')}</Text>
        </Box>
      )}

      {users ? <UsersList users={users} /> : null}

      {users && users.length === 0 && (
        <Text size="2xl" textAlign="center">
          {t('Users.notFollowingAnyone')}
        </Text>
      )}
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}

export default Following
