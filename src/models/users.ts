import { Wishlist } from './wishlist'

export type User = {
  id: string
  name: string
  email: string
  image: string
  wishlists: Wishlist[]
  followers: Array<{
    followerId: string
    followingId: string
  }>
}
