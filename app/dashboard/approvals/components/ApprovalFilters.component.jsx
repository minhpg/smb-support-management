"use client";
import useGroups from "@/hooks/useGroups.hook";
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
import { useSupabaseContext } from "../../contexts/SupabaseClient.context";

const ApprovalFilters = ({ searchParams }) => {
  const { supabase } = useSupabaseContext();
  const { groups } = useGroups(supabase);

  return (
    <Card className="mt-6">
      <form method="get">
        <Grid numItems={3} className="gap-3">
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Approval from</Text>
            <Select name="group" defaultValue={searchParams.group}>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name} {group.campus && `- ${group.campus.name}`}
                </SelectItem>
              ))}
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Status</Text>
            <Select name="status" defaultValue={searchParams.status}>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={2}>
            <Text>Order</Text>
            <Select name="order" defaultValue={searchParams.order}>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Order by</Text>
            <Select name="order_by" defaultValue={searchParams.order_by}>
              <SelectItem value="index">Priority</SelectItem>
              <SelectItem value="created_at">Created at</SelectItem>
              <SelectItem value="request">Request</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={3}>
            <Flex justifyContent="end">
              <Button>Submit</Button>
            </Flex>
          </Col>
        </Grid>
      </form>
    </Card>
  );
};

export default ApprovalFilters;
