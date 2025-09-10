import { Router } from "./pages/router";
import "./app.css";
import { LDProvider } from "launchdarkly-react-client-sdk";
import { Toaster } from 'react-hot-toast';

const LD_CLIENT_ID = import.meta.env.VITE_PUBLIC_LD_CLIENT_ID;

export const App = () => {
  if (!LD_CLIENT_ID) {
    console.warn(
      "LaunchDarkly client-side ID is not set. Feature flags will be disabled."
    );
  }

  return (
    <LDProvider clientSideID={LD_CLIENT_ID}>
      <Router /> 
    </LDProvider>
  );
};
