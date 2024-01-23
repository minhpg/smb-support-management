import getSession from "@/supabase/getSession";
import {
  Button,
  Card,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import ApprovalRow from "./ApprovalRow.component";
import ApprovalFilters from "./ApprovalFilters.component";

const DashboardUpdatesApprovalPage = async ({ searchParams }) => {

  const { supabase } = await getSession();
  let query = supabase
    .from("update_approvals")
    .select(
      "*, update(*, request(*, from(id, first_name, last_name, email, phone), campus (id, name)), update_type (*), created_by (*)), group (*, campus(*))",
    );

  if (searchParams.order && searchParams.order_by) {
    if (searchParams.order == "asc") {
      query.order(searchParams.order_by, {
        ascending: true,
      });
    }
    if (searchParams.order == "desc") {
      query.order(searchParams.order_by, {
        ascending: false,
      });
    }
  }

  if (searchParams.status) {
    if (searchParams.status == "pending") {
      query.eq("approved", false).eq("rejected", false);
    }
    if (searchParams.status == "approved") {
      query.eq("approved", true).eq("rejected", false);
    }
    if (searchParams.status == "rejected") {
      query.eq("approved", false).eq("rejected", true);
    }
  }

  if (searchParams.group) {
    query.eq("group", searchParams.group);
  }

  const { data: approvals } = await query;

  return (
    <>
      <Title>Approvals</Title>
      <ApprovalFilters searchParams={searchParams} />
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Update</TableHeaderCell>
              <TableHeaderCell>Created at</TableHeaderCell>
              <TableHeaderCell>Request</TableHeaderCell>
              <TableHeaderCell>Needs approval from</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvals.map((approval) => (
              <ApprovalRow approval={approval} key={approval.id} />
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default DashboardUpdatesApprovalPage;
