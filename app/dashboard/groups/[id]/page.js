import getSession from "@/supabase/getSession";
import GroupForm from "./GroupForm.component";

const DashboardUserPage = async ({params}) => {
  console.log(params);
  const { supabase } = await getSession();

  const { data } = await supabase
    .from("groups")
    .select()
    .eq("id", params.id)
    .single();

  return <GroupForm user={data} />;
};

export default DashboardUserPage;
