import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SignInParams, SignInResponse } from '../types/signIn';

export const lexiApi = createApi({
  reducerPath: 'lexiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
  }),
  endpoints: (build) => ({
    signIn: build.mutation<SignInResponse, SignInParams>({
      query(credentials) {
        return {
          url: '/auth/signin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: credentials,
        };
      },
    }),
  }),
});

export const { useSignInMutation } = lexiApi;
