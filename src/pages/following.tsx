import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Box, Text, Progress } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'

import { MainLayout } from '../components/ui'
import { UsersSearchForm, UsersList } from '../components/users-search'
import { User } from '../models/users'

const UsersSearch: NextPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const [requestInProgress, setRequestInProgress] = useState(false)
  const [followedUsers, setFollowedUsers] = useState<User[]>([])

  useEffect(() => {
    setRequestInProgress(true)

    // TODO: Add proper typing
    axios
      .get<any[]>('/api/following')
      .then(({ data }) => {
        const mappedUsers = data.map((item) => {
          return item.following
        })

        setRequestInProgress(false)
        setFollowedUsers(mappedUsers)
      })
      .catch((error) => {
        setRequestInProgress(false)
      })
  }, [])

  return (
    <MainLayout>
      <UsersList users={followedUsers} requestInProgress={requestInProgress} />
    </MainLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pl', [
        'common',
        'forms',
        'users-search',
      ])),
    },
  }
}

export default UsersSearch
