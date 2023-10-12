import { httpClient } from '@/lib/httpClient'
import { FollowListUser, FollowingStatus } from '@/models/followers'
import { User } from '@/models/users'

export const UsersService = {
  async search(query: string) {
    return await httpClient.get(`/api/users?query=${query}`).json<User[]>()
  },
  async getUser(id: string) {
    return await httpClient.get(`/api/users/${id}`).json<User>()
  },
  async followUser(id: string) {
    return await httpClient.post(`/api/users/${id}/follow`).json<User>()
  },
  async unfollowUser(id: string) {
    return await httpClient.delete(`/api/users/${id}/follow`).json<User>()
  },
  async getUsersFollowedByMe() {
    return await httpClient.get(`/api/users/followed`).json<{
      accepted: FollowListUser[]
      pending: FollowListUser[]
      rejected: FollowListUser[]
    }>()
  },
  async getPendingFriendsInvites() {
    return await httpClient
      .get(`/api/users/pending-invites`)
      .json<FollowListUser[]>()
  },
  async updatePendingInvite({
    userId,
    status,
  }: {
    userId: string
    status: FollowingStatus
  }) {
    return await httpClient.post(`/api/users/pending-invites`, {
      json: {
        userId,
        status,
      },
    })
  },
}
