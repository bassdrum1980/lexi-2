import { createListenerMiddleware } from '@reduxjs/toolkit';
import { signOut } from '../features/auth/authSlice';
import { lexiApi } from '../services/lexiApiSlice';

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  actionCreator: signOut,
  effect: async () => {
    localStorage.removeItem('token');
  },
});

authListenerMiddleware.startListening({
  matcher: lexiApi.endpoints.signIn.matchFulfilled,
  effect: async (action) => {
    localStorage.setItem('token', action.payload.token);
  },
});
