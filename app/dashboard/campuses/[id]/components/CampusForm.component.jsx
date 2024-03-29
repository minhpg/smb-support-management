"use client";

import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  Text,
  TextInput,
  Title,
} from "@tremor/react";
import { useState } from "react";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";

const CampusForm = ({ campus }) => {
  const { supabase } = useSupabaseContext();

  const [saved, setSaved] = useState(true);

  const onSubmit = async (event) => {
    setSaved(false);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await supabase.from("campuses").upsert({
      id: campus.id,
      name: formData.get("name"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    });

    setSaved(true);
  };

  return (
    <form onSubmit={onSubmit} className="mt-6" onChange={() => setSaved(false)}>
      <Card>
        <Flex>
          <Title>Campus {campus.id}</Title>
          <Text>{saved ? "Saved" : "Not saved"}</Text>
        </Flex>

        <Grid
          numItems={2}
          numItemsMd={4}
          numItemsLg={6}
          numItemsSm={2}
          className="gap-3 mt-6"
        >
          <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
            <Text>Group name</Text>
            <TextInput name="name" type="text" defaultValue={campus?.name} />
          </Col>
          <Col numColSpan={2}>
            <Text>Address</Text>
            <TextInput
              name="address"
              type="text"
              defaultValue={campus?.address}
            />
          </Col>
          <Col numColSpan={2}>
            <Text>Phone</Text>
            <TextInput name="phone" type="text" defaultValue={campus?.phone} />
          </Col>
          <Col numColSpan={2}>
            <Text>Email</Text>
            <TextInput name="email" type="email" defaultValue={campus?.email} />
          </Col>
          <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
            <Flex justifyContent="end">
              <Button>Submit</Button>
            </Flex>
          </Col>
        </Grid>
      </Card>
    </form>
  );
};

export default CampusForm;
