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

const DashboardRequestsPage = async () => {
  const { supabase } = await getSession();
  const { data: requests } = await supabase
    .from("requests")
    .select("*, campus (name), from (id, first_name, last_name)");
  console.log(requests);
  return (
    <>
      <Flex>
        <Title>Requests</Title>
        <Link href="/dashboard/requests/create">
          <Button variant="light">Create request</Button>
        </Link>
      </Flex>
      <Card className="mt-6"></Card>
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
                <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
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
                  <DeleteButton requestId={request.id}/>
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
