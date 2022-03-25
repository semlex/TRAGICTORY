import {
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
} from './userSlice'
import { closeAuthModal } from './authModalSlice'
import { publicRequest, userRequest } from '../utils/requests'

export const login = async (dispatch, user) => {
   dispatch(loginStart())

   await publicRequest.post('/auth/login', user)
      .then(res => {
         dispatch(loginSuccess(res.data))
         dispatch(closeAuthModal())
      }).catch(err => {
         if (err.response) {
            dispatch(loginFailure({
               data: err.response.data,
               status: err.response.status,
               statusText: err.response.statusText
            }))
         }
         else {
            dispatch(loginFailure())
         }
      })
}

export const register = async (dispatch, user) => {
   dispatch(registerStart())

   await publicRequest.post('/auth/register', user)
      .then(res => {
         dispatch(registerSuccess(res.data))
         dispatch(closeAuthModal())
      }).catch(err => {
         if (err.response) {
            dispatch(registerFailure({
               data: err.response.data,
               status: err.response.status,
               statusText: err.response.statusText
            }))
         }
         else {
            dispatch(registerFailure())
         }
      })
}

export const logout = async (dispatch) => {
   dispatch(logoutUser())
}

export const update = async (dispatch, id, user) => {
   dispatch(updateStart())

   await userRequest.put(`/users/update/${id}`, user)
      .then(res => {
         dispatch(updateSuccess(res.data))
      }).catch(err => {
         if (err.response) {
            dispatch(updateFailure({
               data: err.response.data,
               status: err.response.status,
               statusText: err.response.statusText,
               errorPlace: user.password ? 'updatePassword' : 'updateInfo'
            }))
         }
         else {
            dispatch(updateFailure())
         }
      })
}