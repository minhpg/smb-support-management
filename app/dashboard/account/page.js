import getSession from "@/supabase/getSession";
import AccountForm from "./AccountForm.component";

const DashboardAccountPage = async () => {
  const { session, supabase } = await getSession();

  console.log(session);

  const authUser = session?.user;
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", authUser.id)
    .single();

  return <AccountForm user={data} authUser={authUser} />;
};

export default DashboardAccountPage;
