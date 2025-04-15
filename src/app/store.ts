import logger from 'redux-logger';
import {
  combineReducers,
  configureStore,
  type Middleware,
} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { lexiApi } from '../services/lexiApiSlice';
import { authListenerMiddleware } from '../middleware/authListener';

const middleware: Middleware[] = [];
if (import.meta.env.MODE === 'development') {
  middleware.push(logger);
}

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  [lexiApi.reducerPath]: lexiApi.reducer,
  auth: authReducer,
});

// Function to create and configure the store
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(middleware)
        .concat(lexiApi.middleware)
        .prepend(authListenerMiddleware.middleware),
    preloadedState,
  });
}

// Default store instance
export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
