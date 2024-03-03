import { configureStore } from '@reduxjs/toolkit'
import navReducer from "./slices/navSlice"
import authReducer from "./slices/authSlice"

export default store = configureStore({
  reducer: {
    nav: navReducer,
    auth:authReducer
  },
})