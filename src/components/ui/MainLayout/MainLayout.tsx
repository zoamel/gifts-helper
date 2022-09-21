import React, { useState } from 'react'

import { Heading, Progress, Spinner, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { HtmlHead } from './HtmlHead'
import { LayoutContainer } from './LayoutContainer'
import { MainContainer } from './MainContainer'
import { SideNav } from './SideNav'

type Props = {
  children: React.ReactNode
  staticTopElement?: React.ReactNode
  checkingAuth?: boolean
}

export const MainLayout = ({
  children,
  staticTopElement,
  checkingAuth,
}: Props) => {
  const { t } = useTranslation()

  if (checkingAuth) {
    return (
      <>
        <HtmlHead />
        <LayoutContainer>
          <MainContainer>
            <VStack spacing={3} alignItems="center">
              <Heading size="lg">{t('common:checkingAuthState')}</Heading>
              <Progress
                isIndeterminate
                colorScheme="cyan"
                size="xs"
                my={2}
                width="full"
              />
              {/* <Spinner size="xl" color="teal" thickness="4px" speed="0.5s" /> */}
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
        <MainContainer staticTopElement={staticTopElement}>
          {children}
        </MainContainer>
      </LayoutContainer>
    </>
  )
}
