"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState } from "react";

const SupabaseContext = createContext({});

const SupabaseContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data } = await supabase
          .from("users")
          .select("*, role(*), campus(*)")
          .eq("id", session.user.id)
          .single();
        if (data) {
          setUser(data);
        }
      }
    });
  }, [supabase]);

  const data = {
    supabase,
    user,
  };

  return (
    <SupabaseContext.Provider value={data}>{children}</SupabaseContext.Provider>
  );
};

export default SupabaseContextProvider;

export const useSupabaseContext = () => {
  return useContext(SupabaseContext);
};
