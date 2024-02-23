import {
  Button,
  Card,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";

import Link from "next/link";
import RequestStatus from "@/app/dashboard/requests/components/RequestStatus.component";
import DateFormat from "./DateFormat.component";

const LatestPendingRequestsTable = async ({ supabase, searchParams }) => {
  let query = supabase
    .from("requests")
    .select("*, campus (name), from (id, first_name, last_name)")
    .eq("completed", false)
    .eq("rejected", false)
    .order("priority", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  if (searchParams.campus) {
    query.eq("campus", searchParams.campus);
  }

  if (searchParams.group) {
    let respondGroupData = await supabase
      .from("respond_group_members")
      .select("respond_group")
      .eq("group", searchParams.group);
    respondGroups = respondGroupData.data;

    if (respondGroups.length > 0) {
      query = query.or(
        `to.in.(${respondGroups
          .map(({ respond_group }) => respond_group)
          .join(",")})`
      );
    }
  }

  if (searchParams.date_range) {
    const { from, to } = JSON.parse(searchParams.date_range);

    if (from) {
      let fromDate = new Date(from);
      fromDate.setDate(fromDate.getDate() - 1);
      query.gte("created_at", fromDate.toISOString());
    }

    if (to) {
      let toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      query.lte("created_at", toDate.toISOString());
    }
  }

  if (searchParams.status) {
    if (searchParams.status == "pending") {
      query.eq("completed", false).eq("rejected", false);
    }
    if (searchParams.status == "completed") {
      query.eq("completed", true).eq("rejected", false);
    }
    if (searchParams.status == "rejected") {
      query.eq("completed", false).eq("rejected", true);
    }
  }

  if (searchParams.priority) {
    query.eq("priority", searchParams.priority);
  }

  if (searchParams.created_by) {
    query.eq("from", searchParams.created_by);
  }

  const { data: requests } = await query;
  return (
    <Card className="mt-6">
      <Title>Pending requests</Title>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Created at</TableHeaderCell>
            <TableHeaderCell>Created by</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Campus</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Link href={`/dashboard/requests/${request.id}`}>
                  <Button variant="light">{request.title}</Button>
                </Link>
              </TableCell>
              <TableCell>
                <DateFormat date={request.created_at} />
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/users/${request.from.id}`}>
                  <Button variant="light">
                    {request.from.first_name} {request.from.last_name}
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                <RequestStatus task={request} />
              </TableCell>
              <TableCell>
                <Select
                  name="priority"
                  enableClear={false}
                  required
                  disabled
                  value={request.priority.toString()}
                >
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                </Select>
              </TableCell>
              <TableCell>
                {request.campus ? request.campus.name : "No campus assigned"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default LatestPendingRequestsTable;
