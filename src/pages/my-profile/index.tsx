// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'

// * views
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <MyProfilePage />
}

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

export default Index
