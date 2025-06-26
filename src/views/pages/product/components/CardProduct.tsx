// ** React
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'

// ** Mui
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Rating,
  Divider
} from '@mui/material'
import { styled } from '@mui/system'

// ** Component
import Icon from 'src/components/Icon'

// ** Types
import { TProduct } from 'src/types/product'

// ** Other
import { useTranslation } from 'react-i18next'
import { convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useAuth } from 'src/hooks/useAuth'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { likeProductAsync, unLikeProductAsync } from 'src/stores/product/actions'

interface TCardProduct {
  item: TProduct
}

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: '16px',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  flex: 1,
  borderRadius: 10,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 40,
  padding: '0 30px',
  transition: 'transform 0.2s ease-in-out',

  '&:hover': {
    transform: 'scale(1.05)'
  }
}))

const DiscountBadge = styled(Chip)({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#ff3d47',
  color: 'white'
})

const CardProduct = (props: TCardProduct) => {
  // ** Props
  const { item } = props
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(Boolean(user && item?.likedBy?.includes(user._id)))

  const { t, i18n } = useTranslation()
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // ** handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  const handleBuyProductToCart = (item: TProduct) => {
    handleUpdateProductToCart(item)
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,
        query: {
          selected: item._id
        }
      },
      ROUTE_CONFIG.MY_CART
    )
  }

  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const discountItem = isExpiry(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: 1,
      image: item.image,
      price: item.price,
      discount: discountItem,
      product: item._id,
      slug: item.slug
    })
    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }
  const handleToggleLikeProduct = useCallback(
    (id: string, isLiked: boolean) => {
      if (user?._id) {
        if (isLiked) {
          dispatch(unLikeProductAsync({ productId: id }))

          setIsFavorite(false)
        } else {
          dispatch(likeProductAsync({ productId: id }))
          setIsFavorite(true)
        }
      } else {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      }
    },
    [user, dispatch, router]
  )

  const memoIsExpiry = useMemo(() => {
    return isExpiry(item.discountStartDate, item.discountEndDate)
  }, [item])

  return (
    <StyledCard>
      <CardMedia
        component='img'
        height='280'
        image={
          item.image
            ? item.image
            : 'https://www.hydroscand.kz/media/catalog/product/placeholder/default/image-placeholder-base.png'
        }
        alt='Luxury Watch'
        sx={{
          objectFit: 'contain',
          objectPosition: 'center'
        }}
      />
      {item.discount > 0 && memoIsExpiry ? <DiscountBadge label={`${item.discount}% OFF`} /> : ''}
      <Box sx={{ padding: '0 30px' }}>
        <Divider />
      </Box>
      <CardContent sx={{ padding: '25px 18px !important' }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography
            onClick={() => handleNavigateDetails(item.slug)}
            gutterBottom
            variant='h5'
            component='div'
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '48px'
            }}
          >
            {item.name}
          </Typography>
          <IconButton
            onClick={() => handleToggleLikeProduct(item._id, Boolean(isFavorite))}
            aria-label='add to favorites'
          >
            {isFavorite ? (
              <Icon icon='material-symbols-light:favorite' color='#ff3d47' fontSize={30} />
            ) : (
              <Icon icon='material-symbols-light:favorite-outline' fontSize={30} />
            )}
          </IconButton>
        </Box>
        {/* <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {item.description}
        </Typography> */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={item.averageRating} precision={0.5} readOnly size='small' />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
            ({item.totalReviews ? item.totalReviews : 0})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Typography variant='h6' color='primary' sx={{ fontWeight: 'bold' }}>
              {formatNumberToLocal((item.price * (100 - item.discount)) / 100, {
                language: i18n.language as 'vi' | 'en'
              })}
            </Typography>
            {item.discount > 0 && memoIsExpiry ? (
              <Typography variant='body2' color='text.secondary' sx={{ textDecoration: 'line-through' }}>
                {formatNumberToLocal(item.price, { language: i18n.language as 'vi' | 'en' })}
              </Typography>
            ) : (
              ''
            )}
          </Box>
          <Typography variant='body2' color='text.secondary'>
            {t('Sold_product')} {item.sold ? item.sold : 0}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',

            // flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Button
            sx={{ width: '70px' }}
            fullWidth
            variant='outlined'
            disabled={item.countInStock < 1}
            onClick={() => handleUpdateProductToCart(item)}
          >
            <Icon icon='tdesign:cart-add' />
          </Button>
          <StyledButton
            fullWidth
            onClick={() => handleBuyProductToCart(item)}
            startIcon={<Icon icon='fluent:payment-16-regular' />}
            disabled={item.countInStock < 1}
          >
            {item.countInStock < 1 ? t('Buy_now') : t('Out_of_stock')}
          </StyledButton>
        </Box>
      </CardContent>
    </StyledCard>
  )
}

export default CardProduct
