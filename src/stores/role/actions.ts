// Redux
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Service
import { createRoles, deleteRoles, getAllRoles, updateRoles } from 'src/services/role'

// ** Typé
import { TParamsCreateRoles, TParamsEditRoles, TParamsGetRoles } from 'src/types/role'

export const getAllRolesAsync = createAsyncThunk('role/get-all', async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)

  return response
})

export const createRolesAsync = createAsyncThunk('role/create', async (data: TParamsCreateRoles) => {
  const response = await createRoles(data)

  return response
})

export const updateRolesAsync = createAsyncThunk('role/update', async (data: TParamsEditRoles) => {
  const response = await updateRoles(data)

  return response
})

export const deleteRolesAsync = createAsyncThunk('role/delete', async (id: string) => {
  const response = await deleteRoles(id)

  return response
})
