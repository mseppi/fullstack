import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: { message: '', color: '' },
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return { message: '', color: '' }
        }
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const setNotificationWithTimeout = (message, color, timeout) => {
    return dispatch => {
        dispatch(setNotification({ message, color }))
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeout * 1000)
    }
}

export default notificationSlice.reducer