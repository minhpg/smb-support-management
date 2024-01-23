import getSession from "@/supabase/getSession";
import UpdateTypeForm from "./UpdateTypeForm.component";

const DashboardUpdateTypePage = async ({ params }) => {
  const { supabase } = await getSession();

  const { data } = await supabase
    .from("update_types")
    .select("*")
    .eq("id", params.id)
    .single();

  return <UpdateTypeForm updateType={data} />;
};

export default DashboardUpdateTypePage;
