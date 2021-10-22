import React from 'react'
import { HtmlHead } from './HtmlHead'
import { SideNav } from './SideNav'
import { MainContainer } from './MainContainer'
import { LayoutContainer } from './LayoutContainer'

type Props = {
  children: React.ReactNode
}

export const MainLayout = ({ children }: Props) => {
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
