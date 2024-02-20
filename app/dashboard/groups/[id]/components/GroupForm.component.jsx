"use client";

import useCampuses from "@/hooks/useCampuses.hook";
import useGroupUsers from "@/hooks/useGroupUsers.hook";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  SearchSelect,
  SearchSelectItem,
  Text,
  TextInput,
  Title,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { useState } from "react";

const GroupForm = ({ group }) => {
  const supabase = createClientComponentClient();

  const [saved, setSaved] = useState(true);
  const campuses = useCampuses(supabase);

  const {
    groupUsers,
    users,
    loading: usersLoading,
  } = useGroupUsers(supabase, group.id);

  const onSubmit = async (event) => {
    setSaved(false);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const formDataObj = {
      id: group.id,
    };

    formData.forEach((value, key) => {
      if (key.includes("[]")) formDataObj[key] = formData.getAll(key);
      else formDataObj[key] = value;
    });

    await supabase.from("groups").upsert({
      id: group.id,
      name: formData.get("name"),
      campus: formData.get("campus"),
    });

    const groupMembers = formDataObj["group_members[]"];

    // check against existing group members
    if(groupMembers){

      const deletedMemberIds = groupUsers.filter((user) => !groupMembers.includes(user))
      const addedMemberIds = groupMembers.filter((user) => !groupUsers.includes(user))
      
      addedMemberIds.map(async (memberId) => {
          await supabase
            .from("group_members")
            .insert({
              user: memberId,
              group: group.id,
            })
            .select()
            .single();
        });


        deletedMemberIds.map(async (memberId) => {
          await supabase
            .from("group_members")
            .delete()
            .eq('user', memberId)
            .eq('group', group.id)
        });

    }

    

    // console.log(groupMembers);
    // if (groupMembers) {
    //   if (groupMembers.length > 0) {
    //     groupMembers.map(async (memberId) => {
    //       await supabase
    //         .from("group_members")
    //         .upsert({
    //           user: memberId,
    //           group: newGroup.id,
    //         })
    //         .select()
    //         .single();
    //     });
    //   }
    // }
    setSaved(true);
  };

  return (
    <form onSubmit={onSubmit} className="mt-6" onChange={() => setSaved(false)}>
      <Card>
        <Flex>
          <Title>Group {group.id}</Title>
          <Text>{saved ? "Saved" : "Not saved"}</Text>
        </Flex>

        <Grid
          numItems={2}
          numItemsMd={4}
          numItemsLg={6}
          numItemsSm={2}
          className="gap-3 mt-6"
        >
          <Col numColSpan={2}>
            <Text>Group name</Text>
            <TextInput name="name" type="text" defaultValue={group?.name} />
          </Col>
          <Col numColSpan={2}>
            <Text>Campus</Text>
            <SearchSelect name="campus" defaultValue={group?.campus}>
              {campuses.map((campus) => (
                <SearchSelectItem value={campus.id} key={campus.id}>
                  {campus.name}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          </Col>
          <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
            <Flex justifyContent="end">
            <Button>Submit</Button>
            </Flex>
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
                      defaultChecked={groupUsers.includes(user.id)}
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
  );
};

export default GroupForm;
