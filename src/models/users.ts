import { FollowingStatus } from './followers'
import { Wishlist } from './wishlist'

export type User = {
  id: string
  name: string
  email: string
  image: string
  wishlist: Wishlist
  isFollowedByAuthUser?: boolean
  followingStatus: FollowingStatus
}
