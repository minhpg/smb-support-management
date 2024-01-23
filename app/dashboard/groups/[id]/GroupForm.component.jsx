"use client";

import useCampuses from "@/hooks/useCampuses.hook";
import useRoles from "@/hooks/useRoles.hook";
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
} from "@tremor/react";
import { useState } from "react";

const GroupForm = ({ user }) => {
  const supabase = createClientComponentClient();

  const [saved, setSaved] = useState(true);
  const campuses = useCampuses(supabase);
  const roles = useRoles(supabase);

  const onSubmit = async (event) => {
    setSaved(false);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const formDataObj = {
      id: user.id,
    };
    formData.forEach((value, key) => (formDataObj[key] = value));
    await supabase.from("users").upsert(formDataObj);
    setSaved(true);
  };

  return (
    <>
      <Card>
        <Flex>
          <Title>User {user.id}</Title>
          <Text>{saved ? "Saved" : "Not saved"}</Text>
        </Flex>
        <form
          onSubmit={onSubmit}
          className="mt-6"
          onChange={() => setSaved(false)}
        >
          <Grid
            numItems={6}
            numItemsMd={4}
            numItemsLg={6}
            numItemsSm={3}
            className="gap-3"
          >
            <Col numColSpan={3}>
              <Text>First Name</Text>
              <TextInput
                name="first_name"
                type="text"
                defaultValue={user?.first_name}
              />
            </Col>
            <Col numColSpan={3}>
              <Text>Last Name</Text>
              <TextInput
                name="last_name"
                type="text"
                defaultValue={user?.last_name}
              />
            </Col>
            <Col numColSpan={6}>
              <Text>Email</Text>
              <TextInput
                name="email"
                type="email"
                defaultValue={user?.email}
                readOnly
              />
            </Col>
            <Col numColSpan={4}>
              <Text>Phone</Text>
              <TextInput
                name="phone"
                type="text"
                inputMode="numeric"
                defaultValue={user?.phone}
              />
            </Col>
            <Col numColSpan={3}>
              <Text>Campus</Text>
              <SearchSelect name="campus" defaultValue={user?.campus}>
                {campuses.map((campus) => (
                  <SearchSelectItem value={campus.id} key={campus.id}>
                    {campus.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </Col>
            <Col numColSpan={3}>
              <Text>Role</Text>
              <SearchSelect name="role" defaultValue={user?.role}>
                {roles.map((role) => (
                  <SearchSelectItem value={role.id} key={role.id}>
                    {role.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </Col>
            <Col numColSpan={6}>
              <Button>Submit</Button>
            </Col>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default GroupForm;
