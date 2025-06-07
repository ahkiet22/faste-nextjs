// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'

// * views
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import ChangePasswordPage from 'src/views/pages/change-password'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ChangePasswordPage />
}

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

export default Index
