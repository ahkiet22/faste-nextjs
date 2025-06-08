export type TParamsGetCities = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateCity = {
  name: string
}

export type TParamsEditCity = {
  id: string
  name: string
}

export type TParamsDeleteCity = {
  name: string
  id: string
}

export type TParamsDeleteMultipleCity = {
  cityIds: string[]
}
