// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import { createRolesAsync, deleteRolesAsync, getAllRolesAsync, updateRolesAsync } from './actions'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  roles: {
    data: [],
    total: 0
  }
}

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = ''
    }
  },
  extraReducers: builder => {
    // ** get all roles
    builder.addCase(getAllRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.roles.data = action.payload.data.roles
      state.roles.total = action.payload.data.totalCount
    })
    builder.addCase(getAllRolesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.roles.data = []
      state.roles.total = 0
    })

    // ** create roles
    builder.addCase(createRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createRolesAsync.fulfilled, (state, action) => {
      // console.log('ACtion role', action)
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** update roles
    builder.addCase(updateRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete roles
    builder.addCase(deleteRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = roleSlice.actions

export default roleSlice.reducer
