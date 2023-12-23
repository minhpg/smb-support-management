import { Badge } from "@tremor/react";

const RequestStatus = ({ task }) => {
  return (
    <>
      {task.rejected && <Badge color="red">Rejected</Badge>}
      {task.completed && <Badge color="green">Completed</Badge>}
      {!(task.completed || task.rejected) && (
        <Badge color="blue">Pending</Badge>
      )}
    </>
  );
};

export default RequestStatus;
