import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@/lib/store'

let initialState = {
  tokens: {
    list: [],
    active: 0,
    loading: false,
  },
}

const bioSlice = createSlice({
  name: 'bio',
  initialState,
  reducers: {
    setTokensList: (state, action) => {
      if (!action?.payload) return initialState
      state = {
        ...state,
        ...action.payload,
      }
      return state
    },
  },
})

export const { setTokensList } = bioSlice.actions

export const userInfo = (state: AppState) => state.user

export default bioSlice.reducer
