export type WishlistItem = {
  id?: string
  name: string
  url?: string
  description?: string
}

export type Wishlist = {
  id: string
  name: string
  items: WishlistItem[]
}
