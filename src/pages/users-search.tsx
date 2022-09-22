import React, { useState } from 'react'

import { Box, Text } from '@chakra-ui/react'
import axios from 'axios'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { MainLayout } from '../components/ui'
import { UsersList, UsersSearchForm } from '../components/users-search'
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
        (user) => user.email !== session?.user?.email,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainLayout>
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
