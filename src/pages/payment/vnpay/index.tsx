// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'

// ** views
import BlankLayout from 'src/views/layouts/BlankLayout'
import PaymentVNPay from 'src/views/pages/payment/vnpay'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <PaymentVNPay />
}

export default Index
Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
