import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setToken, signOut } from '../features/auth/authSlice';
import { lexiApi } from '../services/lexiApiSlice';
import {
  setTokenToLocalStorage,
  removeTokenFromLocalStorage,
  validateToken,
} from '../utils/auth';

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  matcher: lexiApi.endpoints.signIn.matchFulfilled,
  effect: (action) => {
    const token = validateToken(action.payload.token);
    if (token !== null) {
      setTokenToLocalStorage(action.payload.token);
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
