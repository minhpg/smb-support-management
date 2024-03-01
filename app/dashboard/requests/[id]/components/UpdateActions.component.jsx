"use client";

import { getCurrentTimestampTZ } from "@/utils";
import { Button, Flex } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";

const UpdateActions = ({ update, requestLocked }) => {
  const router = useRouter();
  const { supabase, user } = useSupabaseContext();

  const markFulfilled = async () => {
    const resolved_at = getCurrentTimestampTZ();
    await supabase
      .from("updates")
      .update({
        fulfilled: true,
        resolved_at,
      })
      .eq("id", update.id);
    router.refresh();
  };

  const handleDeleteUpdate = async () => {
    await supabase.from("updates").delete().eq("id", update.id);
    router.refresh();
  };

  if (requestLocked) return <></>;

  return (
    <Flex className="mt-3 gap-3" justifyContent="space-between">
      <Flex justifyContent="end" className="w-full gap-3">
        {update.update_type.requires_deadline &&
          !update.fulfilled &&
          update.created_by.id !== user.id && (
            <Button color="blue" onClick={markFulfilled}>
              Mark as fulfilled
            </Button>
          )}
        <Button color="red" onClick={handleDeleteUpdate}>
          Delete
        </Button>
      </Flex>
    </Flex>
  );
};

export default UpdateActions;
