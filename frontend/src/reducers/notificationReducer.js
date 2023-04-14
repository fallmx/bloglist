import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, error: false, timerId: null },
  reducers: {
    changeNotificationMessage(state, action) {
      state.message = action.payload.message
      state.error = action.payload.error
    },
    removeNotification(state) {
      state.message = null
    },
    setTimerId(state, action) {
      state.timerId = action.payload
    },
    stopTimer(state) {
      clearTimeout(state.timerId)
    },
  },
})

export const {
  changeNotificationMessage,
  removeNotification,
  setTimerId,
  stopTimer,
} = notificationSlice.actions

export const setNotification = (message, error, duration) => {
  return (dispatch) => {
    dispatch(stopTimer())
    dispatch(changeNotificationMessage({ message, error }))
    const timer = setTimeout(() => {
      dispatch(removeNotification())
    }, duration * 1000)
    dispatch(setTimerId(timer))
  }
}

export default notificationSlice.reducer
