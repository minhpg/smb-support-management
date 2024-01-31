"use server";

import getSession from "@/supabase/getSession";
import { redirect } from "next/navigation";

const createGroupFormAction = async (formData) => {
  const { supabase } = await getSession();
  const formDataObj = {};

  formData.forEach((value, key) => {
    if (key.includes("[]")) formDataObj[key] = formData.getAll(key);
    else formDataObj[key] = value;
  });

  const { data: newGroup } = await supabase
    .from("groups")
    .insert({
      name: formData.get("name"),
      campus: formData.get("campus"),
    })
    .select("*")
    .single();

  const groupMembers = formDataObj["group_members[]"];

  if (groupMembers) {
    if (groupMembers.length > 0) {
      groupMembers.map(async (memberId) => {
        await supabase
          .from("group_members")
          .insert({
            user: memberId,
            group: newGroup.id,
          })
          .select()
          .single();
      });
    }
  }
  redirect("/dashboard/groups/" + newGroup.id);
};

export default createGroupFormAction;
