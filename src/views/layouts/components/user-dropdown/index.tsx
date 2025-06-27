// ** React
import * as React from 'react'
import { useRouter } from 'next/router'

// ** Next
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Badge, Divider, styled, Typography } from '@mui/material'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** Icon
import Icon from 'src/components/Icon'

// ** Configs
import { ROUTE_CONFIG } from 'src/configs/route'

// ** Utils
import { toFullName } from 'src/utils'

// ** Translate
import { useTranslation } from 'react-i18next'

// ** Redux
import { useSelector } from 'react-redux'
import { RootState } from 'src/stores'

type TProps = {}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

const UserDropdown = (props: TProps) => {
  // ** Translation
  const { t, i18n } = useTranslation()

  const router = useRouter()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const { user, logout, setUser } = useAuth()
  const { userData } = useSelector((state: RootState) => state.auth)
  const permissionUser = user?.role?.permissions || []

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigateMyProfile = () => {
    router.push(ROUTE_CONFIG.MY_PROFILE)
    handleClose()
  }

  const handleNavigateChangePassword = () => {
    router.push(ROUTE_CONFIG.CHANGE_PASSWORD)
    handleClose()
  }

  const handleNavigateManageSystem = () => {
    router.push(ROUTE_CONFIG.DASHBOARD)
    handleClose()
  }

  const handleNavigateMyProduct = () => {
    router.push(ROUTE_CONFIG.MY_PRODUCT)
    handleClose()
  }

  const handleNavigateMyOrder = () => {
    router.push(ROUTE_CONFIG.MY_ORDER)
    handleClose()
  }

  React.useEffect(() => {
    if (userData) {
      setUser({ ...userData })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.avatar ? (
                  <Image
                    src={user?.avatar || ''}
                    width={0}
                    height={0}
                    alt='avatar'
                    style={{ height: '32px', width: '32px' }}
                  />
                ) : (
                  <Icon icon='uil:user' />
                )}
              </Avatar>
            </StyledBadge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 2, px: 2, pb: 2 }}>
          <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
            <Avatar sx={{ width: 32, height: 32 }}>
              {userData?.avatar ? (
                <Image
                  src={userData?.avatar || ''}
                  width={0}
                  height={0}
                  alt='avatar'
                  style={{ height: '32px', width: '32px' }}
                />
              ) : (
                <Icon icon='uil:user' />
              )}
            </Avatar>
          </StyledBadge>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component={'span'}>
              {toFullName(user?.firstName || '', user?.middleName || '', user?.lastName || '', i18n.language)}
            </Typography>
            <Typography component={'span'}> {user?.role?.name || ''}</Typography>
          </Box>
        </Box>
        <Divider />
        {permissionUser.length > 0 && (
          <MenuItem onClick={handleNavigateManageSystem}>
            <ListItemIcon>
              <Icon icon='carbon:manage-protection' />
            </ListItemIcon>{' '}
            {t('Manage_system')}
          </MenuItem>
        )}
        <MenuItem onClick={handleNavigateMyProfile}>
          <ListItemIcon>
            <Icon icon='uil:user' />
          </ListItemIcon>{' '}
          {t('My_profile')}
        </MenuItem>
        <MenuItem onClick={handleNavigateMyProduct}>
          <ListItemIcon>
            <Icon icon='uil:cart' />
          </ListItemIcon>
          {t('My_product')}
        </MenuItem>
        <MenuItem onClick={handleNavigateMyOrder}>
          <ListItemIcon>
            <Icon icon='lsicon:place-order-filled' />
          </ListItemIcon>
          {t('My_order')}
        </MenuItem>
        <MenuItem onClick={handleNavigateChangePassword}>
          <ListItemIcon>
            <Icon icon='formkit:password' />
          </ListItemIcon>
          {t('Change_password')}
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Icon icon='material-symbols:logout' />
          </ListItemIcon>
          {t('Logout')}
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default UserDropdown
