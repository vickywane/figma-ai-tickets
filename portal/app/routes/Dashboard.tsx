import { createServerClient } from "../lib/supabase/server";
import DashboardPage from "../components/Dashboard";
import Header from "../components/Header";
import { AuthProvider } from "~/contexts/AuthContext";
import {
  getIntegrationsURL,
  getUserIntegrations,
} from "~/actions/integrations";

export async function loader({ request }) {
  const { supabase } = createServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, integrations: [] };
  }

  const redirectURL = await getIntegrationsURL();
  const { integrations } = await getUserIntegrations(user?.id);

  return { user, integrations, redirectURL };
}

export default function Dashboard({ loaderData }) {
  const { user, integrations, redirectURL } = loaderData;

  return (
    <AuthProvider>
      <Header user={user} />

      <DashboardPage {...{ user, integrations, redirectURL }} />
    </AuthProvider>
  );
}
