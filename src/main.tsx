import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { store } from './app/store.ts';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
