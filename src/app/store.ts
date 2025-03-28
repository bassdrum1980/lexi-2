import logger from 'redux-logger';
import { configureStore, type Middleware } from '@reduxjs/toolkit';
import * as authApi from '../api/auth';
import authReducer from '../features/auth/authSlice';

const middleware: Middleware[] = [];
if (import.meta.env.MODE === 'development') {
  middleware.push(logger);
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { authApi }, // Provide authApi as an extra argument
      },
    }).concat(middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
