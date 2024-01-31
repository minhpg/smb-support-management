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

import DeleteButton from "./components/DeleteButton.component";

const DashboardCampusesPage = async () => {
  const { supabase } = await getSession();
  const { data: campuses } = await supabase.from("campuses").select("*");

  return (
    <>
      <Flex>
        <Title>Campuses</Title>
        <Link href="/dashboard/campuses/create">
          <Button variant="light">Create campus</Button>
        </Link>
      </Flex>
      {/* <Card className="mt-6"></Card> */}
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Campus name</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campuses.map((campus) => (
              <TableRow key={campus.id}>
                <TableCell>
                  <Link href={`/dashboard/campuses/${campus.id}`}>
                    <Button variant="light">{campus.name}</Button>
                  </Link>
                </TableCell>
                <TableCell>{campus.address || "None"}</TableCell>
                <TableCell>{campus.phone || "None"}</TableCell>
                <TableCell>{campus.email || "None"}</TableCell>
                <TableCell>
                  <DeleteButton campusId={campus.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default DashboardCampusesPage;
