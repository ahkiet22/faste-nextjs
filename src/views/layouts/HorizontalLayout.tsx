// ** React
import * as React from 'react'

// ** Next
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Link from 'next/link'

// ** Mui
import { styled } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'

// ** component
import IconifyIcon from 'src/components/Icon'
import UserDropdown from './components/user-dropdown'
import ModeToogle from './components/mode-toggle'
import LanguageDropdown from './components/language-dropdown'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** Config
import { ROUTE_CONFIG } from 'src/configs/route'
import CartProduct from './components/cart-product'
import NotificationDropdown from './components/notification-dropdown'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

type TProps = {
  open: boolean
  toggleDrawer: () => void
  isHiddenMenu?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHiddenMenu }) => {
  const { user } = useAuth()

  const router = useRouter()

  const handleNavigateLogin = () => {
    if (router.asPath !== '/') {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    } else {
      router.replace('/login')
    }
  }

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          margin: '0 24px' // keep right padding when drawer closed
        }}
      >
        {!isHiddenMenu && !open && (
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              padding: '10px'

              // ...(open && { display: 'none' })
            }}
          >
            <IconifyIcon icon='ic:round-menu' />
          </IconButton>
        )}
        <Typography
          component='h1'
          variant='h6'
          color='primary'
          noWrap
          sx={{ flexGrow: 1, fontWeight: 600, cursor: 'pointer' }}
        >
          <Link href={ROUTE_CONFIG.HOME}>FASTE</Link>
        </Typography>
        <LanguageDropdown />
        <ModeToogle />
        <CartProduct />
        {user ? (
          <>
            <NotificationDropdown />
            <UserDropdown />
          </>
        ) : (
          <Button type='submit' variant='contained' sx={{ width: 'auto', ml: 2, mr: 2 }} onClick={handleNavigateLogin}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default HorizontalLayout
