import { Button } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import { FollowingStatus } from '@/models/followers'

type Props = {
  followingStatus: FollowingStatus
  isFollowedByAuthUser: boolean
  requestInProgress: boolean
  onFollowUser: () => void
  onUnfollowUser: () => void
  onCancelFollowRequest: () => void
}

export const FollowButton = ({
  followingStatus,
  isFollowedByAuthUser,
  requestInProgress,
  onFollowUser,
  onUnfollowUser,
}: Props) => {
  const t = useTranslations()

  if (!isFollowedByAuthUser) {
    return (
      <Button
        colorScheme="pink"
        onClick={onFollowUser}
        isLoading={requestInProgress}
        size="sm"
      >
        {t('Common.addToFollowed')}
      </Button>
    )
  }

  if (isFollowedByAuthUser && followingStatus === 'PENDING') {
    return (
      <Button colorScheme="yellow" isDisabled size="sm">
        {t('Common.waitingForAcceptance')}
      </Button>
    )
  }

  if (isFollowedByAuthUser && followingStatus === 'REJECTED') {
    return (
      <Button variant="ghost" colorScheme="red" isDisabled size="sm">
        {t('Common.invitationRejected')}
      </Button>
    )
  }

  if (isFollowedByAuthUser && followingStatus === 'ACCEPTED') {
    return (
      <Button
        colorScheme="red"
        onClick={onUnfollowUser}
        isLoading={requestInProgress}
        size="sm"
      >
        {t('Common.stopFollowing')}
      </Button>
    )
  }

  // return (
  //   <Button
  //     colorScheme={user.followingStatus === 'PENDING' ? 'yellow' : 'pink'}
  //     disabled={user.followingStatus === 'PENDING'}
  //     onClick={handleFollowUser}
  //     isLoading={followUserMutation.isLoading}
  //     size="sm"
  //   >
  //     {t('Common.addToFollowed')}
  //   </Button>
  // )
}
