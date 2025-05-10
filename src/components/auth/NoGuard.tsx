/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ReactNode, ReactElement } from 'react'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

interface NoGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const NoGuard = (props: NoGuardProps) => {
  // ** props
  const { children, fallback } = props

  // ** auth
  const auth = useAuth()
  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default NoGuard
