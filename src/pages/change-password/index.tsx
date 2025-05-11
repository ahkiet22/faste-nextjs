// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'

// * views
import ChangePasswordPage from 'src/views/layouts/pages/change-password'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ChangePasswordPage />
}

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

export default Index
