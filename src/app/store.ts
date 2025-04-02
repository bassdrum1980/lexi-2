import logger from 'redux-logger';
import { configureStore, type Middleware } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { lexiApi } from '../services/lexiApiSlice';
import { authListenerMiddleware } from '../middleware/authListener';

const middleware: Middleware[] = [];
if (import.meta.env.MODE === 'development') {
  middleware.push(logger);
}

export const store = configureStore({
  reducer: {
    [lexiApi.reducerPath]: lexiApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(middleware)
      .concat(lexiApi.middleware)
      .prepend(authListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
