import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from './useAuth'
import { useEffect, useState } from 'react'

type TActions = 'CREATE' | 'VIEW' | 'UPDATE' | 'DELETE'

export const usePermission = (key: string, actions: TActions[]) => {
  const { user } = useAuth()
  const defaultValues = {
    VIEW: false,
    CREATE: false,
    UPDATE: false,
    DELETE: false
  }

  const getObjectValue = (obj: any, key: string) => {
    const keys = key?.split('.')
    let result = obj
    if (keys && !!key.length) {
      for (const k of keys) {
        if (k in result) {
          result = result[k]
        } else {
          return undefined
        }
      }
    }

    return result
  }
  
  const [permission, setPermission] = useState(defaultValues)

  const permissionUser = user?.role.permissions ?? []

  useEffect(() => {
    const mapPermission = getObjectValue(PERMISSIONS, key)
    actions.forEach(mode => {
      if (permissionUser?.includes(PERMISSIONS.ADMIN)) {
        defaultValues[mode] = true
      } else if (mapPermission[mode] && permissionUser?.includes(mapPermission[mode])) {
        defaultValues[mode] = true
      } else {
        defaultValues[mode] = false
      }
    })
    setPermission(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  return permission
}
