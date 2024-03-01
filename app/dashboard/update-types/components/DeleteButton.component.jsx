"use client";

import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useSupabaseContext } from "../../contexts/SupabaseClient.context";

const DeleteButton = ({ updateTypeId }) => {
  const { supabase } = useSupabaseContext();
  const router = useRouter();

  const handleDelete = async () => {
    await supabase.from("update_types").delete().eq("id", updateTypeId);
    router.refresh();
  };

  return (
    <Button variant="light" color="red" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteButton;
