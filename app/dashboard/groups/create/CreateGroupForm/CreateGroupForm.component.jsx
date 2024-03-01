"use client";

import useCampuses from "@/hooks/useCampuses.hook";
import useUsers from "@/hooks/useUsers.hook";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";
import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  SearchSelect,
  SearchSelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
  Title,
} from "@tremor/react";
import createGroupFormAction from "./createGroupFormAction";

const CreateGroupForm = ({ user }) => {
  const { supabase } = useSupabaseContext();

  const campuses = useCampuses(supabase);
  const { users, loading: usersLoading } = useUsers(supabase);

  return (
    <>
      <form action={createGroupFormAction}>
        <Card>
          <Flex>
            <Title>New Group</Title>
            <Button>Submit</Button>
          </Flex>
          <Grid
            numItems={2}
            numItemsMd={4}
            numItemsLg={6}
            numItemsSm={2}
            className="gap-3 mt-6"
          >
            <Col numColSpan={2}>
              <Text>Group Name</Text>
              <TextInput name="name" type="text" />
            </Col>
            <Col numColSpan={2}>
              <Text>Campus</Text>
              <SearchSelect name="campus" defaultValue={user?.campus}>
                {campuses.map((campus) => (
                  <SearchSelectItem value={campus.id} key={campus.id}>
                    {campus.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </Col>
          </Grid>
        </Card>
        <Card className="mt-6">
          {usersLoading && <Text>Loading...</Text>}
          {!usersLoading && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell></TableHeaderCell>
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
                      <input
                        type="checkbox"
                        name="group_members[]"
                        id={`group_members_${user.id}`}
                        value={user.id}
                      />
                    </TableCell>
                    <TableCell>
                      {user.first_name} {user.last_name}
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
          )}
        </Card>
      </form>
    </>
  );
};

export default CreateGroupForm;
