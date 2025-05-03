const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const CONFIG_API = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`
  }
}
