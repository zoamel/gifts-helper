import React from 'react'

import { HtmlHead } from './HtmlHead'
import { LayoutContainer } from './LayoutContainer'
import { MainContainer } from './MainContainer'
import { SideNav } from './SideNav'

type Props = {
  children: React.ReactNode
  staticTopElement?: React.ReactNode
}

export const MainLayout = ({ children, staticTopElement }: Props) => {
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
