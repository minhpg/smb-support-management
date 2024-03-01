import {
  Card,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";

import ApprovalRow from "./components/ApprovalRow.component";
import ApprovalFilters from "./components/ApprovalFilters.component";

import getUserProfile from "@/supabase/getUserProfile";
import { Suspense } from "react";
import { LoadingCard } from "../loading";

const DashboardUpdatesApprovalPage = async ({ searchParams }) => {
  return (
    <>
      <Title>Approvals</Title>
      <ApprovalFilters searchParams={searchParams} />
      <Suspense fallback={<LoadingCard />}>
        <ApprovalsBody searchParams={searchParams} />
      </Suspense>
    </>
  );
};

const ApprovalsBody = async ({ searchParams }) => {
  const { supabase, user } = await getUserProfile();
  let query = supabase
    .from("update_approvals")
    .select(
      "*, update(*, request(*, to, from(id, first_name, last_name, email, phone), campus (id, name)), update_type (*), created_by (*)), group (*, campus(*))",
    )
    .is("update.request.completed", false)
    .is("update.request.rejected", false);

  const permissionLevel = user.role.permission_level;

  if (permissionLevel == "MODERATOR") {
    // check moderator groups
    const { data: groups } = await supabase
      .from("group_members")
      .select("group")
      .eq("user", user.id);

    const groupIds = groups.map(({ group }) => group);

    query = query.in("group", groupIds);
  }

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
          {approvals
            .filter((approval) => approval.update.request)
            .map((approval) => (
              <ApprovalRow approval={approval} key={approval.id} />
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DashboardUpdatesApprovalPage;
