import { createAsyncThunk } from '@reduxjs/toolkit';
import type { SignInParams } from '../../api/auth';

export const signIn = createAsyncThunk(
  'auth/sign-in',
  async ({ email, password }: SignInParams, { extra, rejectWithValue }) => {
    try {
      const result = await extra.authApi.postSignIn({
        email,
        password,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
