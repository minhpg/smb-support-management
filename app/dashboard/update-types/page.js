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
import Link from "next/link";
import DeleteButton from "./DeleteButton.component";
import CreateNewUpdateButton from "./CreateNewUpdateTypeButton.component";

const DashboardUpdateTypesPage = async () => {
  const { supabase } = await getSession();
  const { data: updateTypes } = await supabase
    .from("update_types")
    .select("*, campus (id, name)");

  return (
    <>
      <Flex>
        <Title>Update types</Title>
        <CreateNewUpdateButton />
      </Flex>
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Campus</TableHeaderCell>
              <TableHeaderCell>Requires approval</TableHeaderCell>
              <TableHeaderCell>Requires deadline</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updateTypes.map((updateType) => (
              <TableRow key={updateType.id}>
                <TableCell>
                  <Link href={`/dashboard/update-types/${updateType.id}`}>
                    <Button variant="light">{updateType.title}</Button>
                  </Link>
                </TableCell>
                <TableCell>{updateType.description || "None"}</TableCell>
                <TableCell>
                  {updateType.campus ? updateType.campus.name : "None"}
                </TableCell>
                <TableCell>
                  {updateType.requires_approval ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  {updateType.requires_deadline ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  <DeleteButton updateTypeId={updateType.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default DashboardUpdateTypesPage;
