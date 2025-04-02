import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/user';
import { RootState } from '../../app/store';
import { lexiApi } from '../../services/lexiApiSlice';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      lexiApi.endpoints.signIn.matchFulfilled,
      (state, payload) => {
        state.token = payload.payload.token;
        state.user = payload.payload.user;
        state.isAuthenticated = true;
      }
    );
  },
});

export const { signOut } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
