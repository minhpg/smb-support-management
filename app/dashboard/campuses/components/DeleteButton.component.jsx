"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";

const DeleteButton = ({ campusId }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleDelete = async () => {
    await supabase.from("campuses").delete().eq("id", campusId);
    router.replace("/dashboard/campuses");
    router.refresh();
  };

  return (
    <Button variant="light" color="red" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteButton;
