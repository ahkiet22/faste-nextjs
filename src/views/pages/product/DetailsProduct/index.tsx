'use client'

// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { FormHelperText, InputLabel, Rating, Typography, useTheme } from '@mui/material'

//** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'
import IconifyIcon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload/idnex'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG } from 'src/configs/regex'

// ** Services
import { getAuthMe } from 'src/services/auth'
import { getAllRoles } from 'src/services/role'

// ** Utils
import { ConvertBase64, formatFilter, formatNumberToLocal, separationFullName, toFullName } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateAuthMeAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

// ** Other
import { getDetailsProductPublicBySlug } from 'src/services/product'
import { useRouter } from 'next/router'
import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import Image from 'next/image'

type TProps = {}

const DetailsProductPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [dataProduct, setDataProduct] = useState<TProduct | any>({})
  const router = useRouter()
  const { productId } = router.query

  // ** theme
  const theme = useTheme()

  // ** Translate
  const { t, i18n } = useTranslation()

  // ** redux

  // fetch api
  // const fetchGetAllListReviewByProduct = async (id: string) => {
  //   setLoading(true)
  //   await getAllReviews({
  //     params: {
  //       limit: -1,
  //       page: -1,
  //       order: 'createdAt desc',
  //       isPublic: true,
  //       ...formatFilter({ productId: id })
  //     }
  //   })
  //     .then(async response => {
  //       setLoading(false)
  //       const data = response?.data?.reviews
  //       if (data) {
  //         setListReview(data)
  //       }
  //     })
  //     .catch(() => {
  //       setLoading(false)
  //     })
  // }

  const fetchGetDetailsProduct = async (slug: string) => {
    setLoading(true)
    await getDetailsProductPublicBySlug(slug)
      .then(async response => {
        setLoading(false)
        const data = response?.data
        if (data) {
          setDataProduct(data)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (productId) {
      fetchGetDetailsProduct(String(productId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  return (
    <>
      {loading && <Spinner />}
      <Grid container>
        <Box marginTop={{ md: 5, xs: 4 }}>
          <Typography sx={{ color: theme.palette.primary.main, fontWeight: '600', marginBottom: '8px' }}>
            {t('Product_details')}
            {' / '}
            {dataProduct.type?.name} / {dataProduct?.name}
          </Typography>
        </Box>
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%'
            }}
          >
            <Grid container spacing={8}>
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct?.image}
                  alt='banner'
                  width={0}
                  height={0}
                  style={{
                    height: '100%',
                    maxHeight: '400px',
                    width: '100%',
                    objectFit: 'contain',
                    borderRadius: '15px'
                  }}
                />
              </Grid>
              <Grid item md={7} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant='h5'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {dataProduct.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  {!!dataProduct?.averageRating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant='h5'
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          '-webkitLineClamp': '2',
                          '-webkitBoxOrient': 'vertical',
                          textDecoration: 'underline',
                          fontSize: '16px'
                        }}
                      >
                        {dataProduct.averageRating}
                      </Typography>
                      <Rating
                        name='read-only'
                        sx={{ fontSize: '16px' }}
                        defaultValue={dataProduct?.averageRating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                  )}
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {dataProduct.totalReviews > 0 ? (
                      <span>
                        <b>{dataProduct.totalReviews}</b> {t('Review')}
                      </span>
                    ) : (
                      <span>{t('not_review')}</span>
                    )}
                  </Typography>
                  {' | '}
                  {dataProduct.sold && (
                    <Typography variant='body2' color='text.secondary'>
                      <>{t('Sold_product')}</> <b>{dataProduct.sold}</b>
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', mt: 2 }}>
                  <Icon icon='carbon:location' />

                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    {dataProduct?.location?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  {dataProduct.discount > 0 && (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        textDecoration: 'line-through',
                        fontSize: '18px'
                      }}
                    >
                      {formatNumberToLocal(dataProduct.price, {
                        language: i18n.language as 'vi' | 'en'
                      })}
                    </Typography>
                  )}
                  <Typography
                    variant='h4'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '24px'
                    }}
                  >
                    {dataProduct.discount > 0 ? (
                      <>
                        {formatNumberToLocal((dataProduct.price * (100 - dataProduct.discount)) / 100, {
                          language: i18n.language as 'vi' | 'en'
                        })}
                      </>
                    ) : (
                      <>
                        {formatNumberToLocal(dataProduct.price, {
                          language: i18n.language as 'vi' | 'en'
                        })}
                      </>
                    )}{' '}
                  </Typography>
                  {dataProduct.discount > 0 && (
                    <Box
                      sx={{
                        backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                        width: '36px',
                        height: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '2px'
                      }}
                    >
                      <Typography
                        variant='h6'
                        sx={{
                          color: theme.palette.error.main,
                          fontSize: '10px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        - {dataProduct.discount} %
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Box sx={{ flexBasis: '10%', mt: 8, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      onClick={() => {}}
                      sx={{
                        backgroundColor: `${theme.palette.primary.main} !important`,
                        color: `${theme.palette.common.white}`
                      }}
                    >
                      <Icon icon='ic:sharp-minus' />
                    </IconButton>
                    <CustomTextField
                      type='number'
                      value={1}
                      onChange={() => {}}
                      inputProps={{
                        inputMode: 'numeric',
                        min: 1,
                        max: dataProduct.countInStock
                      }}
                      margin='normal'
                      sx={{
                        '.MuiInputBase-input.MuiFilledInput-input': {
                          width: '20px'
                        },
                        '.MuiInputBase-root.MuiFilledInput-root': {
                          borderRadius: '0px',
                          borderTop: 'none',
                          borderRight: 'none',
                          borderLeft: 'none',
                          '&.Mui-focused': {
                            backgroundColor: `${theme.palette.background.paper} !important`,
                            boxShadow: 'none !important'
                          }
                        },
                        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        },
                        'input[type=number]': {
                          MozAppearance: 'textfield'
                        }
                      }}
                    />
                    <IconButton
                      onClick={() => {}}
                      sx={{
                        backgroundColor: `${theme.palette.primary.main} !important`,
                        color: `${theme.palette.common.white}`
                      }}
                    >
                      <Icon icon='ic:round-plus' />
                    </IconButton>
                  </Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 8 }}>
                    {dataProduct.countInStock > 0 ? (
                      <>
                        {t('Still')} <b>{dataProduct?.countInStock}</b> <span>{t('product_in_stock')}</span>
                      </>
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                          width: '60px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '2px',
                          my: 1
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{
                            color: theme.palette.error.main,
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Hết hàng
                        </Typography>
                      </Box>
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    mt: 8,
                    paddingBottom: '10px'
                  }}
                >
                  <Button
                    onClick={() => {}}
                    variant='outlined'
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontWeight: 'bold'
                    }}
                    disabled={dataProduct.countInStock < 1}
                  >
                    <Icon icon='bx:cart' fontSize={24} style={{ position: 'relative', top: '-2px' }} />
                    {t('Add_to_cart')}
                  </Button>
                  <Button
                    disabled={dataProduct.countInStock < 1}
                    variant='contained'
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontWeight: 'bold'
                    }}
                    onClick={() => {}}
                  >
                    <Icon icon='icon-park-outline:buy' fontSize={20} style={{ position: 'relative', top: '-2px' }} />
                    {t('Buy_now')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid container md={12} xs={12} mt={6}>
          <Grid container>
            <Grid container item md={9} xs={12}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mt: 2,
                      backgroundColor: theme.palette.customColors.bodyBg,
                      padding: '8px',
                      borderRadius: '8px'
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}
                    >
                      {t('Description_product')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 4,
                      color: `rgba(${theme.palette.customColors.main}, 1)`,
                      fontSize: '14px',
                      backgroundColor: theme.palette.customColors.bodyBg,
                      padding: 4,
                      borderRadius: '10px'
                    }}
                    dangerouslySetInnerHTML={{ __html: dataProduct.description }}
                  />
                </Box>

                {/* <Box
                  display={{ md: 'block', xs: 'none' }}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '15px',
                    py: 5,
                    px: 4,
                    width: '100%'
                  }}
                  marginTop={{ md: 5, xs: 4 }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}
                  >
                    {t('Review_product')} <b style={{ color: theme.palette.primary.main }}>{listReviews?.length}</b>{' '}
                    {t('ratings')}
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    <CustomCarousel
                      arrows
                      showDots={true}
                      ssr={true}
                      responsive={{
                        superLargeDesktop: {
                          breakpoint: { max: 4000, min: 3000 },
                          items: 4
                        },
                        desktop: {
                          breakpoint: { max: 3000, min: 1024 },
                          items: 3
                        },
                        tablet: {
                          breakpoint: { max: 1024, min: 464 },
                          items: 2
                        },
                        mobile: {
                          breakpoint: { max: 464, min: 0 },
                          items: 1
                        }
                      }}
                    >
                      {listReviews.map((review: TReviewItem) => {
                        return (
                          <Box key={review._id} sx={{ margin: '0 10px' }}>
                            <CardReview item={review} />
                          </Box>
                        )
                      })}
                    </CustomCarousel>
                  </Box>
                </Box>
                <Box
                  display={{ md: 'block', xs: 'none' }}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '15px',
                    py: 5,
                    px: 4,
                    width: '100%'
                  }}
                  marginTop={{ md: 5, xs: 4 }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                      fontWeight: 'bold',
                      fontSize: '18px',
                      mb: '8px'
                    }}
                  >
                    {t('Comment_product')} <b style={{ color: theme.palette.primary.main }}>{listComment?.total}</b>{' '}
                    {t('comments')}
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    <CommentInput onApply={handleComment} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '30px' }}>
                      {listComment?.data?.map((comment: TCommentItemProduct) => {
                        const level: number = -1

                        return <Fragment key={comment._id}>{renderCommentItem(comment, level)}</Fragment>
                      })}
                    </Box>
                  </Box>
                </Box> */}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
          {t('update_my_profile')}
        </Button>
      </Box> */}
    </>
  )
}

export default DetailsProductPage
