// ** Import Next
import { NextPage } from 'next'

// ** pages
import ProductTypeListPage from 'src/views/pages/manage-product/product-type/ProductTypeList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ProductTypeListPage />
}

export default Index
