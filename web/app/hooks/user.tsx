import { createSupbaseClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const supabase = createSupbaseClient();

  supabase.auth.getUser().then(({ data: { user } }) => {
    // console.log("Initial User:", user);
    // setUser(user);
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth State Changed:", { _event, session });

      if (session) {
        setUser(session?.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user };
};
