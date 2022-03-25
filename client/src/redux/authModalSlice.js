import { createSlice } from '@reduxjs/toolkit'

const authModalSlice = createSlice({
   name: 'authModal',
   initialState: {
      isOpen: false,
      status: 'login'
   },
   reducers: {
      openAuthModal: (state, action) => {
         if (action.payload && action.payload.status) {
            state.status = action.payload.status
         }
         state.isOpen = true
      },
      closeAuthModal: (state, action) => {
         state.isOpen = false
      }
   }
})

export const { openAuthModal, closeAuthModal } = authModalSlice.actions

export default authModalSlice.reducer