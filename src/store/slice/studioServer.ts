import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@/lib/store'

let initialState = {
  templates: {},
  profile: {},
  blocks: [],
  contracts: {},
}

const studioServerSlice = createSlice({
  name: 'studioServer',
  initialState,
  reducers: {
    setStudioServerData: (state, action) => {
      if (!action?.payload) return initialState
      state = {
        ...state,
        ...action.payload,
      }
      return state
    },
  },
})

export const { setStudioServerData } = studioServerSlice.actions

export const studioServerInfo = (state: AppState) => state.studioServer

export default studioServerSlice.reducer
