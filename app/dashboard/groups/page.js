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
import Link from "next/link";
import DeleteButton from "./DeleteButton.component";

const DashboardGroupsPage = async () => {
  const { supabase } = await getSession();
  const { data: groups } = await supabase
    .from("groups")
    .select("*, campus (name)");

  return (
    <>
      <Flex>
        <Title>Groups</Title>
        <Link href="/dashboard/groups/create">
          <Button variant="light">Create group</Button>
        </Link>
      </Flex>
      <Card className="mt-6"></Card>
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Group name</TableHeaderCell>
              <TableHeaderCell>Campus</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  {group.campus ? group.campus.name : "None"}
                </TableCell>
                <TableCell>
                  <DeleteButton groupId={group.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default DashboardGroupsPage;
