"use server";

import getSession from "@/supabase/getSession";


const updateUpdateTypeGroupsAction = async (json) => {
  const { supabase } = await getSession();

  const { updateTypeId, selectedGroups } = json;

  // check if removed
  const { data } = await supabase.from("approve_groups").select("group").eq("update_type", updateTypeId);
  const existingIds = data.map((item) => item.group)
  const updatingIds = selectedGroups.map((item) => item.group)

  const filteredIds = existingIds.filter(x => !updatingIds.includes(x));

  filteredIds.forEach(async (value) => {
    await supabase.from("approve_groups").delete().eq("update_type", updateTypeId).eq("group", value)
  })

  selectedGroups.forEach(async (value, index) => {
    await supabase.from("approve_groups").upsert({
      update_type: updateTypeId,
      group: value.id,
      index
    })
  })

};

export default updateUpdateTypeGroupsAction;
