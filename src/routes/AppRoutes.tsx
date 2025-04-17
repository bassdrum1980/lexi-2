import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/protected/ProtectedRoute.tsx';
import SignInPage from '../pages/auth/SignIn.tsx';
import HomePage from '../pages/home/Home.tsx';
import App from '../App.tsx';
import { signinURL } from './index.ts';

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
