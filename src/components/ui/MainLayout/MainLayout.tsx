import React from 'react'
import { Spinner, VStack, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { HtmlHead } from './HtmlHead'
import { SideNav } from './SideNav'
import { MainContainer } from './MainContainer'
import { LayoutContainer } from './LayoutContainer'

type Props = {
  children: React.ReactNode
  checkingAuth?: boolean
}

export const MainLayout = ({ children, checkingAuth }: Props) => {
  const { t } = useTranslation()
  if (checkingAuth) {
    return (
      <>
        <HtmlHead />
        <LayoutContainer>
          <MainContainer>
            <VStack spacing={3} alignItems="center">
              <Heading size="lg">{t('common:checkingAuthState')}</Heading>
              <Spinner size="xl" color="teal" thickness="4px" speed="0.5s" />
            </VStack>
          </MainContainer>
        </LayoutContainer>
      </>
    )
  }

  return (
    <>
      <HtmlHead />
      <LayoutContainer>
        <SideNav />
        <MainContainer>{children}</MainContainer>
      </LayoutContainer>
    </>
  )
}
