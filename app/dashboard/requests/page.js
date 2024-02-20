import {
  Button,
  Card,
  Flex,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react";
import Link from "next/link";

import RequestStatus from "./components/RequestStatus.component";
import DeleteButton from "./components/DeleteButton.component";
import RequestFilters from "./components/RequestFilters.component";
import getUserProfile from "@/supabase/getUserProfile";

const DashboardRequestsPage = async ({ searchParams }) => {
  const { supabase, user } = await getUserProfile();

  const permissionLevel = user.role.permission_level;

  let query = supabase
    .from("requests")
    .select("*, campus (name), from (id, first_name, last_name)", {
      count: "exact",
    });

  if (permissionLevel == "USER") {
    query = query.eq("from", user.id);
  }

  if (permissionLevel == "MODERATOR") {
    // check moderator groups
    const { data: groups } = await supabase
      .from("group_members")
      .select("group")
      .eq("user", user.id);

    const { data: respondGroups } = await supabase
      .from("respond_group_members")
      .select("respond_group")
      .or(groups.map(({ group }) => `group.eq.${group}`).join(","));

    query = query.or(
      respondGroups
        .map(({ respond_group }) => `to.eq.${respond_group}`)
        .join(",")
    );
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
  } else {
    query.order("created_at", {
      ascending: false,
    });
  }

  if (searchParams.date_range) {
    const { from, to } = JSON.parse(searchParams.date_range);
    // query.gte("created_at", from).lte("created_at", toDate.toISOString())

    let fromDate = new Date(from);
    fromDate.setDate(fromDate.getDate() - 1);
    let toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1);

    query
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());
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

  const pageSize = 10;
  const pageIndex = searchParams.page || 1;

  query.range((pageIndex - 1) * pageSize, pageIndex * pageSize - 1);

  if (searchParams.group) {
    const { data: respondGroups } = await supabase
    .from("respond_group_members")
    .select("respond_group")
    .eq('group', searchParams.group)

    if(respondGroups.length > 0){
      query = query.or(
        respondGroups
          .map(({ respond_group }) => `to.eq.${respond_group}`)
          .join(",")
        );
    }
  }

  const { data: requests, count, error } = await query;

  return (
    <>
      <Flex>
        <Title>Requests</Title>
        <Link href="/dashboard/requests/create">
          <Button variant="light">Create request</Button>
        </Link>
      </Flex>
      <RequestFilters searchParams={searchParams} />
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Created at</TableHeaderCell>
              <TableHeaderCell>Resolved at</TableHeaderCell>
              <TableHeaderCell>Created by</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Priority</TableHeaderCell>
              <TableHeaderCell>Campus</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
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
                  {new Date(request.created_at).toLocaleString("vi-vn")}
                </TableCell>
                <TableCell>
                  {request.resolved_at
                    ? new Date(request.resolved_at).toLocaleString("vi-vn")
                    : "None"}
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
                <TableCell>
                  <DeleteButton requestId={request.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Flex className="p-5 w-full" justifyContent="between">
        <div className="w-full">
        <Text>
          Page <b>{pageIndex}</b>
        </Text>
        <Text>
        <b>{((pageIndex-1)*pageSize)+requests.length}</b> out of <b>{count}</b> records
        </Text>
        </div>
        <Flex className="gap-3" justifyContent="end">
          <Link
            href={{
              query: { ...searchParams, page: parseInt(pageIndex) - 1 },
            }}
          >
            <Button variant="light" disabled={pageIndex <= 1}>
              Prev
            </Button>
          </Link>
          <Link
            href={{
              query: { ...searchParams, page: parseInt(pageIndex) + 1 },
            }}
          >
            <Button variant="light" disabled={pageIndex >= count / pageSize}>
              Next
            </Button>
          </Link>
        </Flex>
      </Flex>
    </>
  );
};

export default DashboardRequestsPage;
