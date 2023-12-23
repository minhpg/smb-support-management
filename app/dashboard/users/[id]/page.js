import getSession from "@/supabase/getSession";
import UserForm from "./UserForm.component";

const DashboardUserPage = async ({params}) => {
  console.log(params);
  const { supabase } = await getSession();

  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", params.id)
    .single();

  return <UserForm user={data} />;
};

export default DashboardUserPage;
