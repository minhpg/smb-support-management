"use server";

import getSession from "@/supabase/getSession";

const updateUpdateTypeFormAction = async (formData) => {
  console.log(formData);
  const { supabase } = await getSession();

  const title = formData.get("title");
  const description = formData.get("description");
  const id = formData.get("id");
  const requires_approval = formData.get("requires_approval") ? true : false;
  const requires_deadline = formData.get("requires_deadline") ? true : false;
  const attach_request_items = formData.get("attach_request_items")
    ? true
    : false;
  const attach_existing_request_items = formData.get(
    "attach_existing_request_items"
  )
    ? true
    : false;
  const attach_media = formData.get("attach_media") ? true : false;
  const attach_text = formData.get("attach_text") ? true : false;
  const campus = formData.get("campus") || null;
  return await supabase
    .from("update_types")
    .update({
      title,
      description,
      requires_approval,
      requires_deadline,
      attach_request_items,
      attach_existing_request_items,
      attach_media,
      attach_text,
      campus,
    })
    .select("*")
    .eq("id", id)
    .single();
};

export default updateUpdateTypeFormAction;
