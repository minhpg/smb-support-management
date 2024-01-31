import getSession from "@/supabase/getSession";
import CampusForm from "./components/CampusForm.component";

const DashboardUserPage = async ({ params }) => {
  const { supabase } = await getSession();

  const { data } = await supabase
    .from("campuses")
    .select("*")
    .eq("id", params.id)
    .single();

  return <CampusForm campus={data} />;
};

export default DashboardUserPage;
