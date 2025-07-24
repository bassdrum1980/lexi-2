import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { lexiApi } from '../../services/lexiApiSlice';
import type { IArticle } from '../../types/articles';

interface ArticlesState {
  articles: IArticle[];
}

const initialState: ArticlesState = {
  articles: [],
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      lexiApi.endpoints.createArticle.matchFulfilled,
      (state, payload) => {
        const article = payload.payload.article;
        state.articles.push(article);
      }
    );
  },
});

export const selectArticles = (state: RootState) => state.articles.articles;

export default articlesSlice.reducer;
