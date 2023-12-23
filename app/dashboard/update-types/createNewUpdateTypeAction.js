"use server";
import getSession from "@/supabase/getSession";
const createNewUpdateTypeAction = async () => {
  const { supabase } = await getSession();
  const { data: newUpdateType } = await supabase
    .from("update_types")
    .insert({
      title: "New update type",
    })
    .select()
    .single();
  return newUpdateType.id;
};

export default createNewUpdateTypeAction;
