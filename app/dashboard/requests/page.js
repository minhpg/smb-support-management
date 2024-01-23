import getSession from "@/supabase/getSession";
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
  Title,
} from "@tremor/react";
import RequestStatus from "@/app/dashboard/requests/RequestStatus.component";
import Link from "next/link";
import DeleteButton from "./DeleteButton.component";
import RequestFilters from "./RequestFilters.component";
import getUserProfile from "@/supabase/getUserProfile";

const DashboardRequestsPage = async ({ searchParams }) => {
  const { supabase, user } = await getUserProfile();
  const permissionLevel = user.role.permission_level;
  let query = supabase
    .from("requests")
    .select("*, campus (name), from (id, first_name, last_name)");

  if (permissionLevel == "USER") {
    query = query.eq("from", user.id);
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

  // if(searchParams.group){
  //   query.eq('group', searchParams.group)
  // }

  const { data: requests, error } = await query;

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
                  {new Date(request.created_at).toLocaleString()}
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
    </>
  );
};

export default DashboardRequestsPage;
