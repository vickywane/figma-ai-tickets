import { createServerClient } from "../lib/supabase/server";
import DashboardPage from "../components/Dashboard";
import Header from "../components/Header";
import { AuthProvider } from "~/contexts/AuthContext";
import {
  exchangeIntegrationCode,
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

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { data, error } = await exchangeIntegrationCode(request, {
      token: code as string,
    });

    
  }

  const redirectURL = await getIntegrationsURL(request);

  const { integrations } = await getUserIntegrations(request, user?.id);

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
