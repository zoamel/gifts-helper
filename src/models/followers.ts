import { User } from './users'

export type FollowingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export type FollowListUser = Pick<User, 'id' | 'name' | 'image'>
