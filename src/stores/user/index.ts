// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  createUsersAsync,
  deleteMultipleUserAsync,
  deleteUsersAsync,
  getAllUsersAsync,
  serviceName,
  updateUsersAsync
} from './actions'

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
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: '',
  users: {
    data: [],
    total: 0
  }
}

export const userSlice = createSlice({
  name: serviceName,
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
      ;(state.messageErrorDelete = ''), (state.isSuccessMultipleDelete = false)
      state.isErrorMultipleDelete = true
      state.messageErrorMultipleDelete = ''
    }
  },
  extraReducers: builder => {
    // ** get all users
    builder.addCase(getAllUsersAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllUsersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.users.data = action.payload.data.users
      state.users.total = action.payload.data.totalCount
    })
    builder.addCase(getAllUsersAsync.rejected, (state, action) => {
      state.isLoading = false
      state.users.data = []
      state.users.total = 0
    })

    // ** create user
    builder.addCase(createUsersAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createUsersAsync.fulfilled, (state, action) => {
      // console.log('ACtion role', action)
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** update user
    builder.addCase(updateUsersAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateUsersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete user
    builder.addCase(deleteUsersAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteUsersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete multiple user
    builder.addCase(deleteMultipleUserAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultipleUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action.payload?.data
      state.isErrorMultipleDelete = !action.payload?.data
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = userSlice.actions

export default userSlice.reducer
