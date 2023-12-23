import { Badge } from "@tremor/react";

const DeadlineBadge = ({ deadline }) => {
  const deadlineDate = new Date(deadline).getTime();
  const currentDate = Date.now();
  if (deadlineDate > currentDate) {
    return <Badge color="blue">On track</Badge>;
  }
  return <Badge color="red">Late</Badge>;
};

export default DeadlineBadge;
