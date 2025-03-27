import { createSlice } from '@reduxjs/toolkit';
import { signIn } from './authSlice-actions';
import { RootState } from '../../app/store';

type User = {
  id: string;
  email: string;
  totalCards: number;
};

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
  },
});

export const { signOut } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
