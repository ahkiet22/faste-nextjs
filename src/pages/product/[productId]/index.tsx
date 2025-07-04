// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'
import { getDetailsProductPublicBySlug, getListRelatedProductBySlug } from 'src/services/product'
import { TProduct } from 'src/types/product'

// * views
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import DetailsProductPage from 'src/views/pages/product/DetailsProduct'

type TProps = {
  productData: TProduct
  listRelatedProduct: TProduct[]
}

const Index: NextPage<TProps> = ({ productData, listRelatedProduct }) => {
  return <DetailsProductPage productData={productData} productsRelated={listRelatedProduct} />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

Index.guestGuard = false
Index.authGuard = false

export async function getServerSideProps(context: any) {
  try {
    const slugId = context.query?.productId

    const [res, resRelated] = await Promise.all([
      getDetailsProductPublicBySlug(slugId, true),
      getListRelatedProductBySlug({ params: { slug: slugId } })
    ])

    const productData = res?.data
    const listRelatedProduct = resRelated?.data?.products

    if (!productData?._id) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        productData: productData,
        listRelatedProduct
      }
    }
  } catch (error) {
    return {
      props: {
        productData: {},
        listRelatedProduct: []
      }
    }
  }
}
