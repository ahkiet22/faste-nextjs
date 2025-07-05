// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

// ** Store Imports
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Contexts
import { AuthProvider } from 'src/contexts/AuthContext'

// ** Global css styles
import 'src/styles/globals.scss'

// ** Component
import GuestGuard from 'src/components/auth/GuestGuard'
import AuthGuard from 'src/components/auth/AuthGuard'
import ReactHotToast from 'src/components/react-hot-toast'
import AclGuard from 'src/components/auth/AclGuard'
import NoGuard from 'src/components/auth/NoGuard'
import FallbackSpinner from 'src/components/fall-back'

// ** redux
import { store } from 'src/stores'

// ** Context
import { SettingsConsumer, SettingsProvider } from 'src/contexts/SettingsContext'

// ** Hook
import { useSettings } from 'src/hooks/useSettings'

// ** Theme
import ThemeComponent from 'src/theme/ThemeComponent'

// ** Layout
import UserLayout from 'src/views/layouts/UserLayout'

// ** axios instance
import { AxiosInterceptor } from 'src/helpers/axios'

// ** react query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <NoGuard fallback={<FallbackSpinner />}>{children}</NoGuard>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}

export default function App(props: ExtendedAppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps }
  } = props
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { settings } = useSettings()

  const slugProduct = (router?.query?.productId as string)?.replaceAll('-', ' ')

  // ** react-query
  const [queryClient] = useState(() => new QueryClient())

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  const permission = Component.permission ?? []

  const title = slugProduct
    ? `${themeConfig.templateName} - ${slugProduct}`
    : (Component.title ?? `${themeConfig.templateName} - Mua Sắm Online, Sản Phẩm Chất Lượng Cao`)

  const description =
    Component.description ??
    `${themeConfig.templateName} – cung cấp các sản phẩm chất lượng cao, từ thời trang đến điện tử. Mua sắm trực tuyến với giá tốt nhất!`

  const keywords = Component.keywords ?? 'mua sắm, sản phẩm chất lượng, thời trang, điện tử, FastE'
  const urlImage = Component.urlImage ?? '/faste.png'

  const toastOptions = {
    success: {
      className: 'react-hot-toast',
      style: {
        background: '#DDF6E8'
      }
    },
    error: {
      className: 'react-hot-toast',
      style: {
        background: '#FDE4D5'
      }
    }
  }

  return (
    <Provider store={store}>
      <Head>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta name='author' content='FastE-Developer' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <meta name='image' content={urlImage} />
        <link rel='icon' href='/faste.ico' />

        {/* facebook & instagram */}
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content='https://fasteshop.vercel.app/home' />
        <meta property='og:site_name' content='FastE' />
        <meta property='og:image' content={urlImage} />

        {/* twitter */}
        <meta property='twitter:card' content='website' />
        <meta property='twitter:title' content={title} />
        <meta property='twitter:description' content={description} />
        <meta name='twitter:url' content='https://fasteshop.vercel.app/home' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:image' content={urlImage} />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AxiosInterceptor>
            <SessionProvider session={session}>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard
                            permission={permission}
                            aclAbilities={aclAbilities}
                            guestGuard={guestGuard}
                            authGuard={authGuard}
                          >
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                        <ReactHotToast>
                          <Toaster position={settings.toastPosition} toastOptions={toastOptions} />
                        </ReactHotToast>
                      </ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </SessionProvider>
          </AxiosInterceptor>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
      </QueryClientProvider>
    </Provider>
  )
}
