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
            numItems={2}
            numItemsMd={4}
            numItemsLg={6}
            numItemsSm={2}
            className="gap-3 mt-6"
          >
            <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
              <Text>Campus Name</Text>
              <TextInput name="name" type="text" />
            </Col>
            <Col numColSpan={2}>
              <Text>Address</Text>
              <TextInput name="address" type="text" />
            </Col>
            <Col numColSpan={2}>
              <Text>Phone</Text>
              <TextInput name="phone" type="text" />
            </Col>
            <Col numColSpan={2}>
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
