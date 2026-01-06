// src/App.tsx
import { Outlet } from "react-router-dom";
import { PortalProvider } from "@1mpl0rd/react-ui-components";

const App = () => {
  return (
    <PortalProvider>
      <Outlet />
      <div className="curtain"></div>
    </PortalProvider>
  );
};

export default App;
