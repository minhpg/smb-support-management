import getSession from "@/supabase/getSession";
import GroupForm from "./components/GroupForm.component";

const DashboardUserPage = async ({ params }) => {
  const { supabase } = await getSession();

  const { data } = await supabase
    .from("groups")
    .select("*")
    .eq("id", params.id)
    .single();

  return <GroupForm group={data} />;
};

export default DashboardUserPage;
