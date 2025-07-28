import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Home from "./Home";
import Header from "./components/Header";
import {
  getIntegrationsURL,
  getUserIntegrations,
} from "./actions/integrations";

const getData = async () => {
  const supabase = await createSupabaseServerClient();
  const { data: user, error } = await supabase.auth.getClaims();
  const redirectURL = await getIntegrationsURL();

  if (error || !user?.claims) {
    return redirect("/auth");
  }

  const { integrations } = await getUserIntegrations(user.claims.sub);

  return {
    user: user.claims,
    integrations,
    redirectURL,
  };
};

export default async function Page() {
  const { user, integrations, redirectURL } = await getData();

  return (
    <div>
      <Header user={user} />

      <div className=" bg-slate-100 items-center flex flex-col justify-center min-h-screen">
        <Home
          {...{
            user,
            integrations,
            redirectURL,
          }}
        />
      </div>
    </div>
  );
}
