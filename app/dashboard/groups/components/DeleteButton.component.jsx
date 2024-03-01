"use client";

import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useSupabaseContext } from "../../contexts/SupabaseClient.context";

const DeleteButton = ({ groupId }) => {
  const { supabase } = useSupabaseContext();
  const router = useRouter();

  const handleDelete = async () => {
    await supabase.from("groups").delete().eq("id", groupId);
    router.replace("/dashboard/groups");
    router.refresh();
  };

  return (
    <Button variant="light" color="red" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteButton;
