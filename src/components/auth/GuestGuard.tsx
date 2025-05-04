/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next
import { useRouter } from 'next/router'

// ** Helper
import { getLocalUserData } from 'src/helpers/storage/index'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
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
    if (getLocalUserData().accessToken && getLocalUserData().userData) {
      router.replace('/')
    }
  }, [router.route])

  if (authContext.loading) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
