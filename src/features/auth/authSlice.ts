import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';
import { RootState } from '../../app/store';
import { lexiApi } from '../../services/lexiApiSlice';
import { getTokenFromLocalStorage, isTokenValid } from '../../utils/auth';

interface AuthState {
  user: User | null;
  token: string | null;
}

const token = getTokenFromLocalStorage();

// TODO: implement access/refresh token
const initialState: AuthState = {
  user: null,
  token: isTokenValid(token) ? token : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      const token = action.payload;
      state.token = isTokenValid(token) ? token : null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      lexiApi.endpoints.signIn.matchFulfilled,
      (state, payload) => {
        const token = payload.payload.token;
        state.token = isTokenValid(token) ? token : null;
        state.user = payload.payload.user;
      }
    );
  },
});

export const { signOut, setToken } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

export default authSlice.reducer;
