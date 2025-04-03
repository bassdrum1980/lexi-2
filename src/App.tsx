import { Outlet } from "react-router-dom";
import useSyncToken from "./hooks/useSyncToken";

function App() {
  // Syncs the token between tabs
  useSyncToken();

  return (
    <Outlet />
  )
}

export default App
