import { Outlet } from "react-router-dom";
import useSyncToken from "./hooks/useSyncToken";
import useTokenValidation from "./hooks/useTokenValidation";

function App() {
  // Syncs the token between tabs
  useSyncToken();
  // Validates the token and signs out if expired
  useTokenValidation();

  return (

    <Outlet />

  )
}

export default App
