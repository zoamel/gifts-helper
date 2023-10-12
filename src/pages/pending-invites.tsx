import { Avatar, Box, Button, HStack, Progress, Text } from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GetServerSideProps, NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { ListContainer, ListItem, MainLayout } from '@/components/ui'
import { useGetPendingFriendsInvites } from '@/hooks/useGetPendingFriendsInvites'
import { FollowingStatus } from '@/models/followers'
import { UsersService } from '@/services/user'

const PendingInvites: NextPage = () => {
  useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const t = useTranslations()
  const queryClient = useQueryClient()

  const { data: users, fetchStatus, isError } = useGetPendingFriendsInvites()

  const changePendingInviteStatus = useMutation({
    mutationFn: (payload: { userId: string; status: FollowingStatus }) =>
      UsersService.updatePendingInvite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingInvites'])
    },
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

      {users && users.length === 0 && (
        <Box my={4}>
          <Text fontSize="xl" textAlign="center">
            {t('FriendsList.noPendingInvites')}
          </Text>
        </Box>
      )}

      <ListContainer mt={8}>
        {users?.map((user) => (
          <ListItem
            key={user.id}
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack spacing={2} justifyContent="space-between" width="full">
              <HStack spacing={2} alignItems="center">
                <Avatar name={user.name} src={user.image} size="md" />
                <Text fontSize="xl">{user.name}</Text>
              </HStack>

              <HStack spacing={4} alignItems="center">
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="pink"
                  isLoading={changePendingInviteStatus.isLoading}
                  onClick={() =>
                    changePendingInviteStatus.mutate({
                      userId: user.id,
                      status: 'REJECTED',
                    })
                  }
                >
                  {t('FriendsList.reject')}
                </Button>
                <Button
                  size="sm"
                  colorScheme="cyan"
                  isLoading={changePendingInviteStatus.isLoading}
                  onClick={() =>
                    changePendingInviteStatus.mutate({
                      userId: user.id,
                      status: 'ACCEPTED',
                    })
                  }
                >
                  {t('FriendsList.accept')}
                </Button>
              </HStack>
            </HStack>
          </ListItem>
        ))}
      </ListContainer>
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

export default PendingInvites
