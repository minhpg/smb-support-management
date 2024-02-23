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
import useUsers from "@/hooks/useUsers.hook";

const RequestFilters = ({ searchParams }) => {
  const supabase = createClientComponentClient();
  const { groups } = useGroups(supabase);
  const { users } = useUsers(supabase);
  const campuses = useCampuses(supabase);

  const router = useRouter();

  let defaultRangeState = {
    from: null,
    to: null,
  };

  if (searchParams.date_range) {
    const { from, to } = JSON.parse(searchParams.date_range);
    defaultRangeState = {
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
    };
  }

  const [dateRange, setDateRange] = useState(defaultRangeState);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.set("date_range", JSON.stringify(dateRange));
    const queryString = new URLSearchParams(formData).toString();
    router.replace("/dashboard?" + queryString);
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
            <Text>Created by</Text>
            <SearchSelect
              name="created_by"
              defaultValue={searchParams.created_by}
            >
              {users.map((user) => (
                <SearchSelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} -{" "}
                  {user.campus ? user.campus.name : "No campus assigned"}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          </Col>
          <Col numColSpan={3} numColSpanLg={1}>
            <Text>Group</Text>
            <SearchSelect name="group" defaultValue={searchParams.group}>
              {groups.map((group) => (
                <SearchSelectItem key={group.id} value={group.id}>
                  {`${group.name}${
                    group.campus ? ` - ${group.campus.name}` : ""
                  }`}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          </Col>
          <Col numColSpan={3} numColSpanLg={2}>
            <Text>Date range</Text>
            <DateRangePicker
              name="date-range"
              value={dateRange}
              onValueChange={setDateRange}
              className="min-w-full"
            />
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
