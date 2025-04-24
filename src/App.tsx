import { Outlet } from 'react-router-dom';
import useSyncToken from './hooks/useSyncToken';
import useTokenValidation from './hooks/useTokenValidation';
import { useTheme } from './hooks/useTheme';

function App() {
  // Syncs the token between tabs
  useSyncToken();
  // Validates the token and signs out if expired
  useTokenValidation();
  // Sets the theme based on the current route
  useTheme();

  return <Outlet />;
}

export default App;
