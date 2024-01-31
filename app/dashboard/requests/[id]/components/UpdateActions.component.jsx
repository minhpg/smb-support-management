"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button, Flex } from "@tremor/react";
import { useRouter } from "next/navigation";

const UpdateActions = ({ update, requestLocked }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const markFulfilled = async () => {
    const response = await supabase
      .from("updates")
      .update({
        fulfilled: true,
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
    <Flex className="mt-3 gap-3" justifyContent="end">
      {update.update_type.requires_deadline && !update.fulfilled && (
        <Button color="blue" onClick={markFulfilled}>
          Mark as fulfilled
        </Button>
      )}
      <Button color="red" onClick={handleDeleteUpdate}>
        Delete
      </Button>
    </Flex>
  );
};

export default UpdateActions;
