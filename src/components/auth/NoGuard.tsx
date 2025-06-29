/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useSession } from 'next-auth/react'
import { ReactNode, ReactElement, useEffect } from 'react'
import { clearLocalRememberLoginAuthSocial, clearTemporaryToken } from 'src/helpers/storage'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

interface NoGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const NoGuard = (props: NoGuardProps) => {
  // ** props
  const { children, fallback } = props
  const { status } = useSession()

  // ** auth
  const auth = useAuth()

  useEffect(() => {
    const handleUnload = () => {
      if (status !== 'loading') {
        clearTemporaryToken()
        clearLocalRememberLoginAuthSocial()
      }
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.addEventListener('beforeunload', handleUnload)
    }
  }, [])

  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default NoGuard
