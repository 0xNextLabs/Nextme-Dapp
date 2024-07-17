import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from '@/store/slice/user'
import studioReducer from '@/store/slice/studio'
import studioServerReducer from '@/store/slice/studioServer'
import bioReducer from '@/store/slice/bio'

import config from '@/config'

const reducers = combineReducers({
  user: userReducer,
  studio: studioReducer,
  studioServer: studioServerReducer,
  bio: bioReducer,
})

const persistConfig = {
  key: config.prefix,
  storage,
  whitelist: ['studio', 'user'],
}
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
