export enum ShoppingListItemStatus {
  RESERVED = 'RESERVED',
  BOUGHT = 'BOUGHT',
}

export type WishlistItem = {
  id?: string
  name: string
  url?: string
  description?: string
  isBoughtByAuthUser?: boolean
  isBought?: boolean
}

export type Wishlist = {
  id: string
  name: string
  items: WishlistItem[]
}
