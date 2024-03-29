import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getUserProfile = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let user = null;

  if (session) {
    const { data } = await supabase
      .from("users")
      .select("*, campus (*), role (*)")
      .eq("id", session.user.id)
      .single();
    user = data;
  }

  return {
    user,
    session,
    supabase,
  };
};

export default getUserProfile;
