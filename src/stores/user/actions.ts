// Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Service
import { createUser, deleteMultipleUser, deleteUser, getAllUsers, updateUser } from 'src/services/user'

// ** Types
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'

export const serviceName = 'user'

export const getAllUsersAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetUsers }) => {
    const response = await getAllUsers(data)

    return response
  }
)

export const createUsersAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateUser) => {
  const response = await createUser(data)

  return response
})

export const updateUsersAsync = createAsyncThunk(`${serviceName}/update`, async (data: TParamsEditUser) => {
  const response = await updateUser(data)

  return response
})

export const deleteUsersAsync = createAsyncThunk(`${serviceName}/delete`, async (id: string) => {
  const response = await deleteUser(id)

  return response
})

export const deleteMultipleUserAsync = createAsyncThunk(
  `${serviceName}/delete-multiple`,
  async (data: TParamsDeleteMultipleUser) => {
    const response = await deleteMultipleUser(data)

    return response
  }
)
