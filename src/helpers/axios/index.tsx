// ** lib
import axios, { AxiosRequestConfig } from 'axios'
import { jwtDecode } from 'jwt-decode'

// ** Config
import { BASE_URL, API_ENDPOINT } from 'src/configs/api'

// ** Helper
import {
  clearLocalUserData,
  clearTemporaryToken,
  getLocalUserData,
  getTemporaryToken,
  setLocalUserData

  // setTemporaryToken
} from '../storage'

// ** React
import { FC, useEffect } from 'react'

// ** Next
import { NextRouter, useRouter } from 'next/router'

// ** Type
import { UserDataType } from 'src/contexts/types'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

type TAxiosInterceptor = {
  children: React.ReactNode
}

const instanceAxios = axios.create({ baseURL: BASE_URL })

const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== '/') {
    router.replace({
      pathname: '/login',
      query: { returnUrl: router.asPath }
    })
  } else {
    router.replace('/login')
  }
  setUser(null)
  clearLocalUserData()
  clearTemporaryToken()
}

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (error: any) => void
}[] = []

/**
 * Xử lý tất cả các request đang chờ trong hàng đợi `failedQueue`.
 * Nếu có token mới thì resolve các promise với token,
 * nếu không thì reject các promise với lỗi.
 *
 * @param error - lỗi xảy ra (nếu không có token)
 * @param token - token mới nếu refresh thành công, ngược lại là null
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}

/**
 * Thêm request bị lỗi 401 vào hàng đợi chờ `refreshToken`.
 * Khi có token mới, resolve để tiếp tục request đó với token mới.
 *
 * @param config - cấu hình Axios của request bị treo
 * @returns Promise được resolve với config chứa token mới hoặc bị reject nếu refresh fail
 */
const addRequestQueue = (config: AxiosRequestConfig): Promise<any> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (token: string) => {
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        resolve(config)
      },
      reject: (err: any) => {
        reject(err)
      }
    })
  })
}

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const { setUser, user } = useAuth()
  useEffect(() => {
    const reqInterceptor = instanceAxios.interceptors.request.use(async config => {
      const { accessToken, refreshToken } = getLocalUserData()

      const { temporaryToken } = getTemporaryToken()
      const isPublicApi = config?.params?.isPublic

      if (accessToken || temporaryToken) {
        let decodedAccessToken: any = {}
        if (accessToken) {
          decodedAccessToken = jwtDecode(accessToken)
        } else if (temporaryToken) {
          decodedAccessToken = jwtDecode(temporaryToken)
        }

        if (decodedAccessToken.exp > Date.now() / 1000) {
          config.headers.Authorization = `Bearer ${accessToken ? accessToken : temporaryToken}`
        } else {
          if (refreshToken) {
            const decodedRefreshToken: any = jwtDecode(refreshToken)
            if (decodedRefreshToken.exp > Date.now() / 1000) {
              if (!isRefreshing) {
                isRefreshing = true
                await axios
                  .post(
                    `${API_ENDPOINT.AUTH.INDEX}/refresh-token`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${refreshToken}`
                      }
                    }
                  )
                  .then(res => {
                    const newAccessToken = res.data.data.access_token
                    if (newAccessToken) {
                      config.headers.Authorization = `Bearer ${newAccessToken}`
                      processQueue(null, newAccessToken)
                      if (accessToken) {
                        setLocalUserData(JSON.stringify(user), newAccessToken, refreshToken)
                      }
                    } else {
                      handleRedirectLogin(router, setUser)
                    }
                  })
                  .catch(e => {
                    processQueue(e, null)
                    handleRedirectLogin(router, setUser)
                  })
                  .finally(() => {
                    isRefreshing = false
                  })
              } else {
                return await addRequestQueue(config)
              }
            } else {
              handleRedirectLogin(router, setUser)
            }
          } else {
            handleRedirectLogin(router, setUser)
          }
        }
      } else if (!isPublicApi) {
        handleRedirectLogin(router, setUser)
      }

      if (config?.params?.isPublic) {
        delete config.params.isPublic
      }

      return config
    })

    const resInterceptor = instanceAxios.interceptors.response.use(response => {
      return response
    })

    return () => {
      instanceAxios.interceptors.request.eject(reqInterceptor)
      instanceAxios.interceptors.response.eject(resInterceptor)
    }
  }, [])

  return <>{children}</>
}

export default instanceAxios

export { AxiosInterceptor }
