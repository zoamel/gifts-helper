import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Box, Text } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'

import { MainLayout } from '../components/ui'
import { UsersSearchForm, UsersList } from '../components/users-search'
import { User } from '../models/users'

const UsersSearch: NextPage = () => {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const { t } = useTranslation()

  const [fetchingUsers, setFetchingUsers] = useState(false)
  const [foundUsers, setFoundUsers] = useState<User[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // async function searchForUsers(param: string) {
  //   setFetchingUsers(true)
  //
  //   try {
  //     const { data } = await axios.get<User[]>(`/api/users?q=${param}`)
  //     setFoundUsers(data)
  //     setFetchingUsers(false)
  //     setErrorMessage(null)
  //   } catch (error) {
  //     let message = ''
  //
  //     if (axios.isAxiosError(error)) {
  //       message = error.message
  //     } else {
  //       message = t('wishlist:requestErrorMessage')
  //     }
  //
  //     setErrorMessage(message)
  //     setFetchingUsers(false)
  //   }
  // }

  async function getAllUsers() {
    setFetchingUsers(true)

    const param = 'all'

    try {
      const { data } = await axios.get<User[]>(`/api/users?q=${param}`)
      const filteredData = data.filter(
        (user) => user.email !== session?.user?.email
      )

      setFoundUsers(filteredData)
      setFetchingUsers(false)
      setErrorMessage(null)
    } catch (error) {
      let message = ''

      if (axios.isAxiosError(error)) {
        message = error.message
      } else {
        message = t('wishlist:requestErrorMessage')
      }

      setErrorMessage(message)
      setFetchingUsers(false)
    }
  }

  React.useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <MainLayout checkingAuth={status === 'loading'}>
      {/*<UsersSearchForm*/}
      {/*  onSearch={searchForUsers}*/}
      {/*  requestInProgress={fetchingUsers}*/}
      {/*/>*/}

      {errorMessage && (
        <Box my={4}>
          <Text color="red">{errorMessage}</Text>
        </Box>
      )}

      <UsersList users={foundUsers} requestInProgress={fetchingUsers} />
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
