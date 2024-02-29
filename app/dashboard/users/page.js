import getSession from "@/supabase/getSession";
import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import Link from "next/link";

const DashboardUsersPage = async () => {
  const { supabase } = await getSession();
  const { data: users } = await supabase
    .from("users")
    .select("*, campus (name), role (name)");
  return (
    <>
      <Title>Users</Title>
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Verified</TableHeaderCell>
              <TableHeaderCell>Campus</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/dashboard/users/${user.id}`}>
                    {user.first_name && user.last_name && (
                      <Button variant="light">
                        {user.first_name} {user.last_name}
                      </Button>
                    )}
                    {!(user.first_name && user.last_name) && (
                      <Button variant="light">{user.id}</Button>
                    )}
                  </Link>
                </TableCell>
                <TableCell>{user.title || "None"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user.verified ? (
                    <Badge color="green">Verified</Badge>
                  ) : (
                    <Badge color="red">Not verified</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.campus ? user.campus.name : "No campus assigned"}
                </TableCell>
                <TableCell>
                  {user.role ? user.role.name : "No role assigned"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default DashboardUsersPage;
