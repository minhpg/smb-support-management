"use client";

import useCampuses from "@/hooks/useCampuses.hook";
import useUsers from "@/hooks/useUsers.hook";
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

const CampusForm = ({ campus }) => {
  const supabase = createClientComponentClient();

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
          numItems={6}
          numItemsMd={4}
          numItemsLg={6}
          numItemsSm={3}
          className="gap-3 mt-6"
        >
          <Col numColSpan={3}>
            <Text>Group name</Text>
            <TextInput name="name" type="text" defaultValue={campus?.name} />
          </Col>
          <Col numColSpan={3}>
            <Text>Address</Text>
            <TextInput
              name="address"
              type="text"
              defaultValue={campus?.address}
            />
          </Col>
          <Col numColSpan={3}>
            <Text>Phone</Text>
            <TextInput name="phone" type="text" defaultValue={campus?.phone} />
          </Col>
          <Col numColSpan={3}>
            <Text>Email</Text>
            <TextInput name="email" type="email" defaultValue={campus?.email} />
          </Col>
          <Col numColSpan={6}>
            <Button>Submit</Button>
          </Col>
        </Grid>
      </Card>
    </form>
  );
};

export default CampusForm;
