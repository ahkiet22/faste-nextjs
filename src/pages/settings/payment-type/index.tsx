// ** Import Next
import { NextPage } from 'next'

// ** pages
import PaymentTypeListPage from 'src/views/pages/settings/payment-type/PaymentTypeList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <PaymentTypeListPage />
}

export default Index
