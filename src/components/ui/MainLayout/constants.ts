import {
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'

export const MENU_ITEMS = [
  {
    href: '/wishlist',
    label: 'wishlist',
    icon: QueueListIcon,
  },
  // {
  //   href: '/shopping-list',
  //   label: 'NIE WCHODZIĆ',
  //   icon: ViewListIcon,
  // },
  {
    href: '/users-search',
    label: 'otherUsers',
    icon: MagnifyingGlassIcon,
  },
  {
    href: '/following',
    label: 'followedUsers',
    icon: UserCircleIcon,
  },
  {
    href: '/pending-invites',
    label: 'pendingInvites',
    icon: ExclamationCircleIcon,
  },
]
