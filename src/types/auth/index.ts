export type TLoginAuth = {
  email: string
  password: string
  deviceToken?: string
}

export interface TRegisterAuth extends TLoginAuth {}

export type TChangePassword = {
  currentPassword: string
  newPassword: string
}

export type TForgotPasswordAuth = {
  email: string
}

export type TResetPasswordAuth = {
  newPassword: string
  secretKey: string
}

export type TSocial = 'google' | 'facebook'
