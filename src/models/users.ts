import { Wishlist } from './wishlist'

export type User = {
  id: string
  name: string
  email: string
  image: string
  wishlist: Wishlist
}
