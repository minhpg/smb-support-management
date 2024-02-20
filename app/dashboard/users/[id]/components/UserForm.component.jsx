"use client";

import useCampuses from "@/hooks/useCampuses.hook";
import useRoles from "@/hooks/useRoles.hook";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Badge,
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserForm = ({ user }) => {
  const supabase = createClientComponentClient();

  const [saved, setSaved] = useState(true);
  const campuses = useCampuses(supabase);
  const roles = useRoles(supabase);
  const router = useRouter();

  const onSubmit = async (event) => {
    setSaved(false);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const formDataObj = {
      id: user.id,
    };
    formData.forEach((value, key) => {
      formDataObj[key] = value.length > 0 ? value : null;
    });
    await supabase.from("users").upsert(formDataObj);
    setSaved(true);
  };

  const revokeVerification = async () => {
    setSaved(false);
    await supabase.from("users").upsert({
      id: user.id,
      verified: false,
    });
    setSaved(true);
    router.refresh();
  };

  const handleVerify = async () => {
    setSaved(false);
    await supabase.from("users").upsert({
      id: user.id,
      verified: true,
    });
    setSaved(true);
    router.refresh();
  };

  return (
    <>
      <Card>
        <Flex>
          <Flex className="gap-3" justifyContent="start">
            {/* <Title>User {user.id}</Title> */}
            {user.verified ? (
              <Badge color="green">User Verified</Badge>
            ) : (
              <Badge color="red">User Not verified</Badge>
            )}
          </Flex>
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
                defaultValue={user?.email}
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
                <SearchSelectItem value={null}>Unallocated</SearchSelectItem>
                {campuses.map((campus) => (
                  <SearchSelectItem value={campus.id} key={campus.id}>
                    {campus.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </Col>
            <Col numColSpan={2} numColSpanMd={3}>
              <Text>Role</Text>
              <SearchSelect name="role" defaultValue={user?.role}>
                {roles.map((role) => (
                  <SearchSelectItem value={role.id} key={role.id}>
                    {role.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </Col>
            <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
              <Flex>
                <Button>Save</Button>
                <Flex className="gap-3" justifyContent="end">
                  {user.verified ? (
                    <Button color="red" onClick={revokeVerification}>
                      Revoke
                    </Button>
                  ) : (
                    <Button color="green" onClick={handleVerify}>
                      Verify
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Col>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default UserForm;
