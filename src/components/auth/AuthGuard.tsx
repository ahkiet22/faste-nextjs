/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next
import { useRouter } from 'next/router'

// ** Helper
import { clearLocalUserData, getLocalUserData } from 'src/helpers/storage'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  // ** props
  const { children, fallback } = props

  // ** auth
  const authContext = useAuth()
  
  // ** router
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (authContext.user === null && !getLocalUserData().accessToken && !getLocalUserData().userData) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
      authContext.setUser(null)
      clearLocalUserData()
    }
  }, [router.route])

  if (authContext.loading || authContext.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
