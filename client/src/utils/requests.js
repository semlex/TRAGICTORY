import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api/'
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

const getCurrentToken = () => {
   const user = JSON.parse(localStorage.getItem('persist:auth'))
   const currentUser = user && JSON.parse(user.currentUser)
   return currentUser?.accessToken
}

export const publicRequest = axios.create({
   baseURL: BASE_URL
})

const userRequest = axios.create({
   baseURL: BASE_URL,
   headers: { token: getCurrentToken() }
})

userRequest.interceptors.request.use((config) => {
   const token = getCurrentToken()

   if (token) {
      config.headers.token = token
      return config
   }
   else {
      return config
   }
})

export { userRequest }