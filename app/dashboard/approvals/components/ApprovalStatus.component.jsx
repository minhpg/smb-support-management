import { Badge } from "@tremor/react";

const ApprovalStatus = ({ approval }) => {
  return (
    <>
      {approval.rejected && <Badge color="red">Rejected</Badge>}
      {approval.approved && <Badge color="green">Approved</Badge>}
      {!(approval.approved || approval.rejected) && (
        <Badge color="blue">Pending</Badge>
      )}
    </>
  );
};

export default ApprovalStatus;
