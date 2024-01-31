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
import createCampusFormAction from "./createCampusFormAction";

const CreateCampusForm = () => {

  return (
    <>
      <form action={createCampusFormAction}>
        <Card>
          <Flex>
            <Title>New Campus</Title>
            <Button>Submit</Button>
          </Flex>
          <Grid
            numItems={6}
            numItemsMd={4}
            numItemsLg={6}
            numItemsSm={3}
            className="gap-3 mt-6"
          >
            <Col numColSpan={2}>
              <Text>Group Name</Text>
              <TextInput name="name" type="text" />
            </Col>
            <Col numColSpan={3}>
              <Text>Address</Text>
              <TextInput name="address" type="text" />
            </Col>
            <Col numColSpan={3}>
              <Text>Phone</Text>
              <TextInput name="phone" type="text" />
            </Col>
            <Col numColSpan={3}>
              <Text>Email</Text>
              <TextInput name="email" type="email" />
            </Col>
          </Grid>
        </Card>
      </form>
    </>
  );
};

export default CreateCampusForm;
