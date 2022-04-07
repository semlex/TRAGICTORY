import { configureStore, combineReducers } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import authModalReducer from './authModalSlice'
import userReducer from './userSlice'
import {
   persistStore,
   persistReducer,
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
   key: 'root',
   storage,
   blacklist: ['user', 'authModal']
}

const userPersistConfig = {
   key: 'auth',
   storage: storage,
   blacklist: ['isError', 'error']
}

const rootReducer = combineReducers({
   cart: cartReducer,
   user: persistReducer(userPersistConfig, userReducer),
   authModal: authModalReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         },
      }),
   devTools: false
})

export const persistor = persistStore(store)
export default store