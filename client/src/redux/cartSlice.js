import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
   name: 'cart',
   initialState: {
      products: [],
      quantity: 0,
      total: 0
   },
   reducers: {
      addProduct: (state, action) => {
         state.quantity += 1
         const existItem = state.products.find(elem => elem._id === action.payload._id)
         if (existItem) {
            if (existItem.countInStock > existItem.quantity) {
               existItem.quantity += 1
               state.total += action.payload.price
            }
         }
         else {
            if (action.payload.countInStock > 0) {
               state.products.push({ ...action.payload, quantity: 1 })
               state.total += action.payload.price
            }
         }
      },
      deleteProduct: (state, action) => {
         if (state.products.find(elem => elem._id === action.payload._id).quantity > 1) {
            state.quantity -= 1
            state.products.find(elem => elem._id === action.payload._id).quantity -= 1
            state.total -= action.payload.price
         }
      },
      fullDeleteProduct: (state, action) => {
         const existItem = state.products.find(elem => elem._id === action.payload._id)
         if (existItem) {
            state.quantity -= existItem.quantity
            state.total -= existItem.price * existItem.quantity
            state.products = state.products.filter(elem => elem._id !== existItem._id)
         }
      },
      clearCart: (state, action) => {
         state.products = []
         state.quantity = 0
         state.total = 0
      }
   }
})

export const { addProduct, deleteProduct, fullDeleteProduct, clearCart } = cartSlice.actions

export default cartSlice.reducer