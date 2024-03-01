"use client";
import { getCurrentTimestampTZ } from "@/utils";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";

const ChangeRequestStatus = ({ requestId }) => {
  const { supabase } = useSupabaseContext();
  const router = useRouter();

  const updateRequest = async (obj) => {
    await supabase.from("requests").update(obj).eq("id", requestId);
    router.refresh();
  };

  const markPending = async () => {
    await updateRequest({
      rejected: false,
      completed: false,
      resolved_at: null,
    });
  };

  const markRejected = async () => {
    const resolved_at = getCurrentTimestampTZ();
    await updateRequest({
      rejected: true,
      completed: false,
      resolved_at,
    });
  };

  const markCompleted = async () => {
    const resolved_at = getCurrentTimestampTZ();
    await updateRequest({
      rejected: false,
      completed: true,
      resolved_at,
    });
  };

  return (
    <>
      <Button onClick={markPending}>Mark as Pending</Button>
      <Button color="red" onClick={markRejected}>
        Mark as Rejected
      </Button>
      <Button color="green" onClick={markCompleted}>
        Mark as Completed
      </Button>
    </>
  );
};

export default ChangeRequestStatus;
