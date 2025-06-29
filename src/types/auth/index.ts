export type TLoginAuth = {
  email: string
  password: string
}

export interface TRegisterAuth extends TLoginAuth {}

export type TChangePassword = {
  currentPassword: string
  newPassword: string
}

export type TSocial = 'google' | 'facebook'
