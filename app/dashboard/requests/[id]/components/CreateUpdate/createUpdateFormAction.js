"use server";

import getSession from "@/supabase/getSession";
import { revalidatePath } from "next/cache";
import { v4 } from "uuid";

const createUpdateFormAction = async (formData) => {
  try {
    // Create Supabase client
    const {
      supabase,
      session: { user },
    } = await getSession();

    // Get form data fields
    let text = formData.get("text");
    let items = formData.get("items");
    let request = formData.get("request");
    let update_type = formData.get("update_type");
    let deadline = formData.get("deadline");
    let equipment_request = formData.get("equipment_request");

    // Validate fields
    if (text.length == 0) text = null;
    if (deadline.length == 0) deadline = null;
    if (equipment_request.length == 0) equipment_request = null;

    items.length == 0 ? (items = []) : (items = JSON.parse(items));

    let images = formData.getAll("media[]");

    const created_by = user.id;

    // Upload images
    let mediaGroup = null;
    if (images.length > 0) {
      if (images[0].size == 0) mediaGroup = null;
      else mediaGroup = await uploadImages(supabase, images);
    }

    // Create request items
    if (!equipment_request) {
      if (items.length > 0) {
        const { data: equipmentRequest } = await supabase
          .from("equipment_requests")
          .insert({
            created_by,
            request,
          })
          .select()
          .single();

        for (const item of items) {
          await supabase.from("equipment_request_items").insert({
            equipment_request: equipmentRequest.id,
            ...item,
          });
        }

        equipment_request = equipmentRequest.id;
      }
    }

    const updateObj = {
      created_by,
      text,
      request,
      update_type,
      media: mediaGroup ? mediaGroup.id : null,
      equipment_request,
      deadline,
    };

    // Create new request
    const { data: update, error } = await supabase
      .from("updates")
      .insert(updateObj)
      .select()
      .single();

    // Create approval members
    const { data: approvalMembers } = await supabase
      .from("approve_groups")
      .select("group, index")
      .eq("update_type", update_type);
    for (const member of approvalMembers) {
      await supabase.from("update_approvals").insert({
        update: update.id,
        ...member,
      });
    }

    // await notifyNewUpdate(update.id)

    revalidatePath("/dashboard/requests/" + request);

    return {
      success: true,
      message: "created new support request",
      data: update,
    };

    // const url = `/dashboard/requests/${data.id}`
    // redirect(url)
  } catch (e) {
    // return {
    //   success: false,
    //   message: e.message
    // }
  }
};

const uploadImages = async (supabase, files) => {
  // Register media group
  const { data: newMediaGroup, error } = await supabase
    .from("media")
    .insert({})
    .select("*")
    .single();
  const mediaGroupId = newMediaGroup.id;

  // Upload and register media files
  for (const file of files) {
    const { name, type, size } = file;
    /** Random uuid path */
    const path = `public/${v4()}`;

    // Upload to bucket
    const response = await supabase.storage.from("media").upload(path, file);
    console.log(response);

    // Register media items
    await supabase.from("media_items").insert({
      media: mediaGroupId,
      path,
      name,
      type,
      size,
    });
  }

  // Return media groups
  return newMediaGroup;
};

export default createUpdateFormAction;
