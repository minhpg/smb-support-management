"use client";
import useCampuses from "@/hooks/useCampuses.hook";
import useGroups from "@/hooks/useGroups.hook";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Button,
  Card,
  Col,
  DateRangePicker,
  Flex,
  Grid,
  SearchSelect,
  SearchSelectItem,
  Select,
  SelectItem,
  Text,
} from "@tremor/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useUsers from '@/hooks/useUsers.hook'

const RequestFilters = ({ searchParams }) => {
  const supabase = createClientComponentClient();
  const { groups } = useGroups(supabase);
  const { users } = useUsers(supabase)
  const campuses = useCampuses(supabase);

  const router = useRouter();

  const { from, to } = searchParams.date_range ? JSON.parse(searchParams.date_range) : { from: null, to: null}

  const [dateRange, setDateRange] = useState({
    from: new Date(from),
    to: new Date(to)
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.set("date_range", JSON.stringify(dateRange));
    const queryString = new URLSearchParams(formData).toString();
    router.replace("/dashboard/requests?" + queryString);
  };

  return (
    <Card className="mt-6">
      <form method="get" onSubmit={handleSubmit}>
        <Grid numItems={3} className="gap-3">
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Campus</Text>
            <Select name="campus" defaultValue={searchParams.campus}>
              {campuses.map((campus) => (
                <SelectItem key={campus.id} value={campus.id}>
                  {campus.name}
                </SelectItem>
              ))}
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Status</Text>
            <Select name="status" defaultValue={searchParams.status}>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Priority</Text>
            <Select name="priority" defaultValue={searchParams.priority}>
              <SelectItem value="1">Low</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">High</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Created by</Text>
            <SearchSelect name="created_by" defaultValue={searchParams.created_by}>
              {users.map((user) => (
                <SearchSelectItem key={user.id} value={user.id}>
                  { user.first_name } { user.last_name } - {user.campus ? user.campus.name : "No campus assigned"}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Group</Text>
            <SearchSelect name="group" defaultValue={searchParams.group}>
              {groups.map((group) => (
                <SearchSelectItem key={group.id} value={group.id}>
                  {`${group.name}${group.campus ? ` - ${group.campus.name}` : ""}`}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Date range</Text>
            <DateRangePicker
              name="date-range"
              value={dateRange}
              onValueChange={setDateRange}
              className="min-w-full"
            />
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Order</Text>
            <Select name="order" defaultValue={searchParams.order}>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={3} numColSpanLg={2}>
            <Text>Order by</Text>
            <Select name="order_by" defaultValue={searchParams.order_by}>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created_at">Created at</SelectItem>
              <SelectItem value="resolved_at">Resolved at</SelectItem>
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

export default RequestFilters;
