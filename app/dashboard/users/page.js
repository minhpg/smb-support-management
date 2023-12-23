import getSession from "@/supabase/getSession";
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import Link from "next/link";

const DashboardUsersPage = async () => {
  const { supabase } = await getSession();
  const { data: users } = await supabase
    .from("users")
    .select("*, campus (name), role (name)");
  console.log(users);
  return (
    <>
      <Card></Card>
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Campus</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/dashboard/users/${user.id}`}>
                    <Button variant="light">{user.first_name} {user.last_name}</Button>
                  </Link>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
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
