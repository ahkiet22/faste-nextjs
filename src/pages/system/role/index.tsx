// ** Import Next
import { NextPage } from 'next'

// pages 
import RoleListPage from 'src/views/layouts/pages/system/role/RoleList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <RoleListPage />
}

export default Index
