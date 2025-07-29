import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupbaseClient } from "../clients/supabase";
import { LOGOUT_USER, SET_USER_AUTH, SET_USER_CLIENT_AUTH } from "../consts/messages";

import useUserStore from "../stores/user";
import { AuthEvents } from "../consts/events";
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
      if (_event === AuthEvents.SIGNED_IN && session) {
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

      if (_event === AuthEvents.SIGNED_OUT) {
        parent.postMessage(
          {
            pluginMessage: {
              type: LOGOUT_USER,
              data: null,
            },
          },
          "*"
        );

        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!session) {
    return (
      <div className="flex h-full items-center px-8">
        <div className="w-full">
          <h1 className="text-center mb-4 font-semibold">
            Figma Tickets Helper
          </h1>
          <Auth
            providers={[]}
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                input: {
                  height: "40px",
                  fontSize: "12px",
                  padding: "0 .5rem",
                },
                label: {
                  fontSize: "13px",
                },
                button: {
                  height: "40px",
                },
              },
            }}
          />
        </div>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
