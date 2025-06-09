// ** Import Next
import { NextPage } from 'next'

// ** pages
import DeliveryTypeListPage from 'src/views/pages/settings/delivery-type/DeliveryTypeList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <DeliveryTypeListPage />
}

export default Index
