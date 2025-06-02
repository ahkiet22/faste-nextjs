// ** Import Next
import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permission'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <>Dashboard</>
}

Index.permission = [PERMISSIONS.DASHBOARD]
export default Index
