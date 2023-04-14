import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { setNotification } from './notificationReducer'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export const getUserFromStorage = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedUser))
      blogService.setToken(loggedUser.token)
    }
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const newLogin = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(newLogin))
      blogService.setToken(newLogin.token)
      dispatch(setUser(newLogin))
      dispatch(setNotification(`logged in as ${newLogin.name}`, false, 5))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification(exception.response.data.error, true, 5))
    }
  }
}

export const logout = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedUser')
    dispatch(setUser(null))
  }
}

export default userSlice.reducer
