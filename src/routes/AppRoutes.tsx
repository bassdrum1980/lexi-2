import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/shared/ProtectedRoute/';
import SignInPage from '../pages/auth/SignIn.tsx';
import ArticlesPage from '../pages/articles/Articles.tsx';
import HomePage from '../pages/home/Home.tsx';
import App from '../App.tsx';
import { signinURL, articlesURL } from './index.ts';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<App />}
      >
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            index
            element={<HomePage />}
          />
          <Route
            path={articlesURL}
            element={<ArticlesPage />}
          />
        </Route>

        {/* Public Routes */}
        <Route
          path={signinURL}
          element={<SignInPage />}
        />
      </Route>

      {/* Fallback route - redirects any unmatched path to the root */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};
