"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";

const ChangeRequestStatus = ({ requestId }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const updateRequest = async (obj) => {
    await supabase.from("requests").update(obj).eq("id", requestId);
    router.refresh();
  };

  const markPending = async () => {
    await updateRequest({
      rejected: false,
      completed: false,
    });
  };

  const markRejected = async () => {
    await updateRequest({
      rejected: true,
      completed: false,
    });
  };

  const markCompleted = async () => {
    await updateRequest({
      rejected: false,
      completed: true,
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
