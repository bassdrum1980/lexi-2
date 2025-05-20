import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setToken, signOut } from '../features/auth/authSlice';
import { lexiApi } from '../services/lexiApiSlice';
import {
  setTokenToLocalStorage,
  removeTokenFromLocalStorage,
  isTokenValid,
} from '../utils/auth';

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  matcher: lexiApi.endpoints.signIn.matchFulfilled,
  effect: (action) => {
    const token = isTokenValid(action.payload.token)
      ? action.payload.token
      : null;
    if (token !== null) {
      setTokenToLocalStorage(token);
    }
  },
});

authListenerMiddleware.startListening({
  actionCreator: signOut,
  effect: () => {
    removeTokenFromLocalStorage();
  },
});

authListenerMiddleware.startListening({
  actionCreator: setToken,
  effect: (action, listenerApi) => {
    if (action.payload === null) {
      listenerApi.dispatch(signOut());
    }
  },
});
