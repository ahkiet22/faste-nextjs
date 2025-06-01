export type TParamsGetRoles = {
  limit?: number
  page?: number
  search?: string
  order?: string
}
export type TParamsCreateRoles = {
  name: string
}

export type TParamsEditRoles = {
  id: string
  name: string
  permissions?: string[]
}

export type TParamsDeleteRoles = {
  id: string
}
