import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SignInParams, SignInResponse } from '../types/signIn';
import type { RootState } from '../app/store';
import type {
  CreateArticleParams,
  CreateArticleResponse,
  GetArticleResponse,
} from '../types/articles';

export const lexiApi = createApi({
  reducerPath: 'lexiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; // Adjust path to your token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    // Authentication
    signIn: build.mutation<SignInResponse, SignInParams>({
      query(params) {
        return {
          url: '/auth/signin',
          method: 'POST',
          body: params,
        };
      },
    }),
    // Articles
    createArticle: build.mutation<CreateArticleResponse, CreateArticleParams>({
      query(params) {
        return {
          url: '/articles/',
          method: 'POST',
          body: params,
        };
      },
    }),
    // Get Article
    getArticle: build.query<GetArticleResponse, string>({
      query: (slug) => `/articles/${slug}`,
    }),
  }),
});

export const {
  useSignInMutation,
  useCreateArticleMutation,
  useGetArticleQuery,
} = lexiApi;
