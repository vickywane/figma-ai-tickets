import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupbaseClient } from "../clients/supabase";
import { SET_USER_AUTH, SET_USER_CLIENT_AUTH } from "../consts/messages";

import useUserStore from "../stores/user";

const supabase = createSupbaseClient();

const AuthWrapper = ({ children }) => {
  const [session, setSession] = useState(null);
  const { setUser } = useUserStore((state) => state);

  onmessage = async (event) => {
    const msg = event.data.pluginMessage;

    if (msg.type === SET_USER_CLIENT_AUTH) {
      supabase.auth.setSession({
        access_token: msg.data.access_token,
        refresh_token: msg.data.refresh_token,
      });
    }
  };
 
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "SIGNED_IN" && session) {
        parent.postMessage(
          {
            pluginMessage: {
              type: SET_USER_AUTH,
              data: {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
              },
            },
          },
          "*"
        );
 
        setSession(session);
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="p-8" >
        <Auth
          providers={[]}
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              input: {
                height: "40px",
                fontSize: "14px",
                padding: "0 .5rem",
              }, 
              button: {
                height: "40px",
              }
            },
          }}
        />
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
