import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
   name: 'user',
   initialState: {
      currentUser: null,
      isFetching: false,
      isError: false,
      errorPlace: '',
      error: {}
   },
   reducers: {
      loginStart: (state) => {
         state.isFetching = true
      },
      loginSuccess: (state, action) => {
         state.isFetching = false
         state.isError = false
         state.errorPlace = ''
         state.error = {}
         state.currentUser = action.payload
      },
      loginFailure: (state, action) => {
         state.isFetching = false
         state.isError = true
         state.errorPlace = 'login'
         if (action.payload) {
            state.error = action.payload
         }
      },
      logoutUser: (state) => {
         state.currentUser = null
         state.isFetching = false
         state.isError = false
         state.errorPlace = ''
         state.error = {}
      },
      registerStart: (state) => {
         state.isFetching = true
      },
      registerSuccess: (state, action) => {
         state.isFetching = false
         state.isError = false
         state.errorPlace = ''
         state.error = {}
         state.currentUser = action.payload
      },
      registerFailure: (state, action) => {
         state.isFetching = false
         state.isError = true
         state.errorPlace = 'register'
         if (action.payload) {
            state.error = action.payload
         }
      },
      updateStart: (state, action) => {
         state.isFetching = true
      },
      updateSuccess: (state, action) => {
         state.isFetching = false
         state.isError = false
         state.errorPlace = ''
         state.error = {}
         state.currentUser = {...state.currentUser, ...action.payload }
      },
      updateFailure: (state, action) => {
         state.isFetching = false
         state.isError = true
         if (action.payload) {
            const { errorPlace, ...error } = action.payload
            state.error = error
            state.errorPlace = errorPlace
         }
      }
   }
})

export const {
   loginStart,
   loginSuccess,
   loginFailure,
   registerStart,
   registerSuccess,
   registerFailure,
   updateStart,
   updateSuccess,
   updateFailure,
   logoutUser
} = userSlice.actions
export default userSlice.reducer