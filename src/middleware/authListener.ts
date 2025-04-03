import { createListenerMiddleware } from '@reduxjs/toolkit';
import { signOut } from '../features/auth/authSlice';
import { lexiApi } from '../services/lexiApiSlice';
import {
  setTokenToLocalStorage,
  removeTokenFromLocalStorage,
} from '../utils/auth';

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  matcher: lexiApi.endpoints.signIn.matchFulfilled,
  effect: (action) => {
    setTokenToLocalStorage(action.payload.token);
  },
});

authListenerMiddleware.startListening({
  actionCreator: signOut,
  effect: () => {
    removeTokenFromLocalStorage();
  },
});
