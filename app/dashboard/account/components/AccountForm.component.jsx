"use client";

import useCampuses from "@/hooks/useCampuses.hook";
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

const AccountForm = ({ authUser, user }) => {
  const supabase = createClientComponentClient();

  const [saved, setSaved] = useState(true);
  const campuses = useCampuses(supabase);

  const onSubmit = async (event) => {
    setSaved(false);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const formDataObj = {
      id: authUser.id,
    };
    formData.forEach((value, key) => {
      formDataObj[key] = value.length > 0 ? value : null;
    });
    
    await supabase.from("users").upsert(formDataObj);
    setSaved(true);
  };

  return (
    <>
      <Card>
        <Flex>
          <Title>My account</Title>
          <Text>{saved ? "Saved" : "Not saved"}</Text>
        </Flex>
        <form
          onSubmit={onSubmit}
          className="mt-6"
          onChange={() => setSaved(false)}
        >
          <Grid
            numItems={2}
            numItemsMd={4}
            numItemsLg={6}
            numItemsSm={2}
            className="gap-3"
          >
            <Col numColSpan={2}>
              <Text>First Name</Text>
              <TextInput
                name="first_name"
                type="text"
                defaultValue={user?.first_name}
              />
            </Col>
            <Col numColSpan={2}>
              <Text>Last Name</Text>
              <TextInput
                name="last_name"
                type="text"
                defaultValue={user?.last_name}
              />
            </Col>
            <Col numColSpan={2} numColSpanMd={3}>
              <Text>Email</Text>
              <TextInput
                name="email"
                type="email"
                defaultValue={user ? user.email : authUser.email}
                readOnly
              />
            </Col>
            <Col numColSpan={2} numColSpanMd={3}>
              <Text>Phone</Text>
              <TextInput
                name="phone"
                type="text"
                inputMode="numeric"
                defaultValue={user?.phone}
              />
            </Col>
            <Col numColSpan={2} numColSpanMd={4}>
              <Text>Campus</Text>
              <SearchSelect name="campus" defaultValue={user?.campus}>
                {campuses.map((campus) => (
                  <SearchSelectItem value={campus.id} key={campus.id}>
                    {campus.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </Col>
            <Col numColSpan={2}  numColSpanMd={4} numColSpanLg={6}>
              <Flex justifyContent="end">
              <Button>Save</Button>
              </Flex>
            </Col>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default AccountForm;
