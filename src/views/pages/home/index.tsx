// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Grid, styled, Tabs, TabsProps } from '@mui/material'
import * as React from 'react'
import Tab from '@mui/material/Tab'

// ** Components

import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import CustomPagination from 'src/components/custom-pagination'
import CustomSelect from 'src/components/custom-select'
import NoData from 'src/components/no-data'
import FilterProduct from '../product/components/FilterProduct'
import CardSkeleton from '../product/components/CardSkeleton'
import ChatBotAI from 'src/components/chat-bot-ai'

// import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'

// ** Config
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'

// ** Services
import { getAllProductsPublic } from 'src/services/product'
import { getAllCities } from 'src/services/city'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'

// import { getCountProductStatus } from 'src/services/report'

// ** Utils
import { formatFilter } from 'src/utils'

// ** Others
import CardProduct from 'src/views/pages/product/components/CardProduct'
import { TProduct } from 'src/types/product'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/product'
import toast from 'react-hot-toast'

// import CardCountProduct from 'src/views/pages/manage-product/product/component/CardCountProduct'

interface TOptions {
  label: string
  value: string
}

type TProps = {
  products: TProduct[]
  totalCount: number
  productTypesServer: TOptions[]
  paramsServer: {
    limit: number
    page: number
    order: string
    productType: string
  }
}

interface TProductPublicState {
  data: TProduct[]
  total: number
}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    overflow: 'auto !important',
    borderBottom: 'none',

    '& .MuiTabs-scroller': {
      overflow: 'auto !important',
      '&::-webkit-scrollbar': {
        opacity: 0
      }
    }
  }
}))

const HomePage: NextPage<TProps> = props => {
  // ** Props
  const { products, totalCount, paramsServer, productTypesServer } = props

  // ** Translate
  const { t } = useTranslation()

  // State
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')

  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [page, setPage] = useState(1)
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [reviewSelected, setReviewSelected] = useState('')
  const [locationSelected, setLocationSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [productsPublic, setProductsPublic] = useState<TProductPublicState>({
    data: [],
    total: 0
  })
  const [productTypeSelected, setProductTypeSelected] = useState('')

  // ** Ref
  const firstRender = useRef<boolean>(false)
  const isServerRendered = useRef<boolean>(false)

  // ** Redux
  const { isSuccessLike, messageErrorLike, isErrorLike, typeError } = useSelector((state: RootState) => state.product)
  const dispatch: AppDispatch = useDispatch()

  // fetch api
  const handleGetListProducts = async () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    await getAllProductsPublic(query).then(res => {
      if (res?.data) {
        setLoading(false)
        setProductsPublic({
          data: res?.data?.products,
          total: res?.data?.totalCount
        })
      }
    })

    // dispatch(getAllProductsAsync(query))
  }

  // handle
  const handleFilterProduct = (value: string, type: string) => {
    switch (type) {
      case 'review': {
        setReviewSelected(value)
        if (!firstRender.current) {
          firstRender.current = true
        }
        break
      }
      case 'location': {
        setLocationSelected(value)
        if (!firstRender.current) {
          firstRender.current = true
        }
        break
      }
    }
  }

  const handleResetFilter = () => {
    setLocationSelected('')
    setReviewSelected('')
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (!firstRender.current) {
      firstRender.current = true
    }
    setProductTypeSelected(newValue)
  }

  const handleOnchangePagination = (page: number, pageSize: number) => {
    // CSR
    setPage(page)
    setPageSize(pageSize)
    if (!firstRender.current) {
      firstRender.current = true
    }

    // SSR
    // router.push(`/home?page=${page}&limit=${pageSize}`)
  }

  // ** fetch api
  const fetchAllCities = async () => {
    setLoading(true)
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.cities
        if (data) {
          setOptionCities(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!isServerRendered.current && paramsServer && !!productTypesServer.length) {
      setPage(paramsServer.page)
      setPageSize(paramsServer.limit)
      setSortBy(paramsServer.order)
      if (paramsServer.productType) {
        setProductTypeSelected('')
      }
      setProductsPublic({
        data: products,
        total: totalCount
      })
      setOptionTypes(productTypesServer)
      isServerRendered.current = true
    }
  }, [paramsServer, products, totalCount, productTypesServer])

  useEffect(() => {
    if (isServerRendered.current && firstRender.current) {
      setFilterBy({ productType: productTypeSelected, minStar: reviewSelected, productLocation: locationSelected })
    }
  }, [productTypeSelected, reviewSelected, locationSelected])

  useEffect(() => {
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (isServerRendered.current && firstRender.current) {
      handleGetListProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize, filterBy])

  useEffect(() => {
    if (firstRender.current) {
      if (isSuccessLike) {
        toast.success(t('Like_product_success'))

        dispatch(resetInitialState())
      } else if (isErrorLike && messageErrorLike && typeError) {
        const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
        if (errorConfig) {
          toast.error(t(errorConfig))
        } else {
          toast.error(t('Like_product_error'))
        }
        dispatch(resetInitialState())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessLike, isErrorLike, messageErrorLike, typeError])

  return (
    <>
      {loading && <Spinner />}
      <ChatBotAI />
      <Box
        sx={{
          height: '100%',
          width: '100%'
        }}
      >
        <StyledTabs value={productTypeSelected} onChange={handleChange} aria-label='wrapped label tabs example'>
          <Tab value={''} label={t('All')} defaultChecked />
          {optionTypes.map(opt => {
            return <Tab key={opt.value} value={opt.value} label={opt.label} />
          })}
        </StyledTabs>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Box sx={{ display: 'flex', gap: '20px', width: { sm: 'auto', xs: '100%' } }}>
            <Box sx={{ width: { sm: '300px', xs: '50%' } }}>
              <CustomSelect
                fullWidth
                onChange={e => {
                  if (!firstRender.current) {
                    firstRender.current = true
                  }
                  setSortBy(e.target.value as string)
                }}
                value={sortBy}
                options={[
                  {
                    label: t('Sort_best_sold'),
                    value: 'sold desc'
                  },
                  {
                    label: t('Sort_new_create'),
                    value: 'createdAt desc'
                  },
                  {
                    label: t('Sort_high_view'),
                    value: 'views desc'
                  },
                  {
                    label: t('Sort_high_like'),
                    value: 'totalLikes desc'
                  }
                ]}
                placeholder={t('Sort_by')}
              />
            </Box>
            <Box sx={{ width: { sm: '300px', xs: '50%' } }}>
              <InputSearch
                placeholder={t('Search_name_product')}
                value={searchBy}
                onChange={(value: string) => {
                  if (!firstRender.current) {
                    if (!!value) {
                      firstRender.current = true
                    }
                  }
                  setSearchBy(value)
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: '100%',
            width: '100%',
            mt: 4,
            mb: 8
          }}
        >
          <Grid
            container
            spacing={{
              md: 6,
              xs: 4
            }}
          >
            <Grid item md={2} display={{ md: 'flex', xs: 'none' }}>
              <Box sx={{ width: '100%', paddingTop: 4 }}>
                <FilterProduct
                  locationSelected={locationSelected}
                  reviewSelected={reviewSelected}
                  handleReset={handleResetFilter}
                  optionCities={optionCities}
                  handleFilterProduct={handleFilterProduct}
                />
              </Box>
            </Grid>
            <Grid item md={10} xs={12}>
              {loading ? (
                <Grid
                  container
                  spacing={{
                    md: 6,
                    xs: 6
                  }}
                >
                  {Array.from({ length: 6 }).map((_, index) => {
                    return (
                      <Grid item key={index} xl={2.4} lg={3} md={4} sm={6} xs={12}>
                        <CardSkeleton />
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={{
                    md: 1,
                    xs: 1
                  }}
                >
                  {productsPublic?.data?.length > 0 ? (
                    <>
                      {productsPublic?.data?.map((item: TProduct) => {
                        return (
                          <Grid item key={item._id} xl={2.4} lg={3} md={4} sm={6} xs={12}>
                            <CardProduct item={item} />
                          </Grid>
                        )
                      })}
                    </>
                  ) : (
                    <Box sx={{ width: '100%', mt: 10 }}>
                      <NoData widthImage='60px' heightImage='60px' textNodata={t('No_product')} />
                    </Box>
                  )}
                </Grid>
              )}
              {/* {totalCount && ( */}
              <Box mt={6}>
                <CustomPagination
                  onChangePagination={handleOnchangePagination}
                  pageSizeOptions={PAGE_SIZE_OPTIONS}
                  pageSize={pageSize}
                  page={page}
                  rowLength={productsPublic.total}
                  isHideShowed
                />
              </Box>
              {/* )} */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default HomePage
