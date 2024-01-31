"use client";
import useCampuses from "@/hooks/useCampuses.hook";
import useGroups from "@/hooks/useGroups.hook";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  Select,
  SelectItem,
  Text,
} from "@tremor/react";

const RequestFilters = ({ searchParams }) => {
  const supabase = createClientComponentClient();
  const { groups } = useGroups(supabase);
  const campuses = useCampuses(supabase);

  return (
    <Card className="mt-6">
      <form method="get">
        <Grid numItems={3} className="gap-3">
          <Col>
            <Text>Campus</Text>
            <Select name="campus" defaultValue={searchParams.campus}>
              {campuses.map((campus) => (
                <SelectItem key={campus.id} value={campus.id}>
                  {campus.name}
                </SelectItem>
              ))}
            </Select>
          </Col>
          <Col>
            <Text>Status</Text>
            <Select name="status" defaultValue={searchParams.status}>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </Select>
          </Col>
          <Col>
            <Text>Priority</Text>
            <Select name="priority" defaultValue={searchParams.priority}>
              <SelectItem value="1">Low</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">High</SelectItem>
            </Select>
          </Col>
          {/* <Col>
            <Text>Group</Text>
            <Select name="group" defaultValue={searchParams.group}>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {`${group.name}${group.campus ? ` - ${group.campus.name}` : ""}`}
                </SelectItem>
              ))}
            </Select>
          </Col> */}
          <Col>
            <Text>Order</Text>
            <Select name="order" defaultValue={searchParams.order}>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </Select>
          </Col>
          <Col>
            <Text>Order by</Text>
            <Select name="order_by" defaultValue={searchParams.order_by}>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created_at">Created at</SelectItem>
              <SelectItem value="request">Request</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={3}>
            <Flex justifyContent="end">
              <Button>Submit</Button>
            </Flex>
          </Col>
        </Grid>
      </form>
    </Card>
  );
};

export default RequestFilters;
