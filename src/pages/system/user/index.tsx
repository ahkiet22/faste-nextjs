// ** Import Next
import { NextPage } from 'next'

// ** Config
import { PERMISSIONS } from 'src/configs/permission'

// ** views
import UserListPage from 'src/views/pages/system/user/UserList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <UserListPage />
}

Index.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
export default Index
