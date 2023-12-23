"use client";

import { useRouter } from "next/navigation";
import createNewUpdateTypeAction from "./createNewUpdateTypeAction";
import { Button } from "@tremor/react";

const CreateNewUpdateTypeButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="light"
      onClick={async () => {
        const newUpdateTypeId = await createNewUpdateTypeAction();
        router.replace("/dashboard/update-types/" + newUpdateTypeId);
      }}
    >
      Create update type
    </Button>
  );
};

export default CreateNewUpdateTypeButton;
