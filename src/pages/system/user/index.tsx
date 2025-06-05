// ** Import Next
import { NextPage } from 'next'

// ** Config
import { PERMISSIONS } from 'src/configs/permission'

// ** Pages
import UserListPage from 'src/views/layouts/pages/system/user/UserList'


type TProps = {}

const Index: NextPage<TProps> = () => {
  return <UserListPage />
}

Index.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
export default Index
