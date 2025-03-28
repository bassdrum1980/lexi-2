import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './pages/auth/ProtectedRoute.tsx'
import SignInPage from './pages/auth/SignIn.tsx'
import HomePage from './pages/home/Home.tsx'
import * as appRoutes from './routes/';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<App />}
          >
            <Route element={<ProtectedRoute />}>
              <Route
                index
                element={<HomePage />}
              />
            </Route>
            <Route
              path={appRoutes.signinURL}
              element={<SignInPage />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
