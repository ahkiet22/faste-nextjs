export type TParamsGetRoles = {
  limit?: number
  page?: number
  search?: string
  order?: string
}
export type TParamsCreateRoles = {
  name: string
  permissions?: string[]
}

export type TParamsEditRoles = {
  name: string
  id: string
  permissions?: string[]
}

export type TParamsDeleteRoles = {
  id: string
}
