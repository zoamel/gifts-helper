import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { UsersService } from '@/services/user'

export const useGetPendingFriendsInvites = () => {
  const { status } = useSession()

  return useQuery(
    ['pendingInvites'],
    () => UsersService.getPendingFriendsInvites(),
    {
      enabled: status === 'authenticated',
    },
  )
}
