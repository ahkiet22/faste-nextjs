// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'

// * views
import MyProfilePage from 'src/views/layouts/pages/my-profile'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <MyProfilePage />
}

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

export default Index
