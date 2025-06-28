// ** Import Next
import { NextPage } from 'next'

// ** views
import ReviewListPage from 'src/views/pages/manage-order/reviews/ReviewList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ReviewListPage />
}

export default Index
