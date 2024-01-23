"use server";

import { v4 } from "uuid";
import getSession from "@/supabase/getSession";

const createRequestFormAction = async (formData) => {
  try {
    // Create Supabase client
    const {
      supabase,
      session: { user },
    } = await getSession();

    // Get form data fields
    let title = formData.get("title");
    let description = formData.get("description");
    let to = formData.get("to");
    let campus = formData.get("campus");
    let priority = formData.get("priority");
    let location = formData.get("location");

    // Validate fields
    if (title.length == 0) title = null;
    if (description.length == 0) description = null;
    if (to.length == 0) to = null;
    if (campus.length == 0) campus = null;
    if (location.length == 0) location = null;
    if (priority.length == 0) priority = 2;

    let images = formData.getAll("image[]");

    // Upload images
    let mediaGroup = null;
    if (images[0].size == 0) mediaGroup = null;
    else mediaGroup = await uploadImages(supabase, images);

    // Create new respond group
    const { data: newRespondGroup } = await supabase
      .from("respond_groups")
      .insert({})
      .select()
      .single();

    if (to) {
      // const { data: createMemberData, error: createMemberError } =
      await supabase.from("respond_group_members").insert({
        respond_group: newRespondGroup.id,
        group: to,
      });
      // .select().single()
    }

    const requestObj = {
      from: user.id,
      title,
      description,
      campus,
      priority,
      location,
      media: mediaGroup ? mediaGroup.id : null,
      to: newRespondGroup.id,
    };

    // Create new request
    const { data, error } = await supabase
      .from("requests")
      .insert(requestObj)
      .select()
      .single();

    // email moderators

    return {
      success: true,
      message: "created new support request",
      data,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
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
    /** Random uuid path */
    const path = `public/${v4()}`;

    // Upload to bucket
    await supabase.storage.from("media").upload(path, file);

    // Register media items
    await supabase.from("media_items").insert({
      media: mediaGroupId,
      path,
    });
  }

  // Return media groups
  return newMediaGroup;
};

export default createRequestFormAction;
