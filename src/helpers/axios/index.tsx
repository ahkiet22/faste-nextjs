// ** lib
import axios from 'axios'
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
import { FC } from 'react'

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

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const { setUser, user } = useAuth()

  instanceAxios.interceptors.request.use(async config => {
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
                if (res.data.data.access_token) {
                  const newAccessToken = res.data.data.access_token
                  config.headers.Authorization = `Bearer ${newAccessToken}`
                  if (accessToken) {
                    setLocalUserData(JSON.stringify(user), newAccessToken, refreshToken)
                  }
                } else {
                  handleRedirectLogin(router, setUser)
                }
              })
              .catch(e => {
                handleRedirectLogin(router, setUser)
              })
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

    return config
  })

  instanceAxios.interceptors.response.use(response => {
    return response
  })

  return <>{children}</>
}

export default instanceAxios

export { AxiosInterceptor }
