import getSession from "@/supabase/getSession";
import AccountForm from "./components/AccountForm.component";

const DashboardAccountPage = async () => {
  const { session, supabase } = await getSession();

  const authUser = session?.user;
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", authUser.id)
    .single();

  return <AccountForm user={data} authUser={authUser} />;
};

export default DashboardAccountPage;
