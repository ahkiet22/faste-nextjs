// ** Import Next
import { NextPage } from 'next'

// ** views
import CommentListPage from 'src/views/pages/manage-product/comment/CommentList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <CommentListPage />
}

export default Index
