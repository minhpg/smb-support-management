"use server";

import getSession from "@/supabase/getSession";
import { redirect } from "next/navigation";

const createCampusFormAction = async (formData) => {
  const { supabase } = await getSession();

  const { data: newCampus } = await supabase
    .from("campuses")
    .insert({
      name: formData.get("name"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    })
    .select("*")
    .single();

  redirect("/dashboard/campuses/" + newCampus.id);
};

export default createCampusFormAction;
