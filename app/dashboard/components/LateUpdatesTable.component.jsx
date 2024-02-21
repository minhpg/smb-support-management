import getSession from "@/supabase/getSession";
import {
  Button,
  Card,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";

import Link from "next/link";
import DeadlineBadge from "@/app/dashboard/requests/components/DeadlineBadge.component";
import { getCurrentTimestampTZ } from "@/utils";
import DateFormat from "./DateFormat.component";

const LateUpdatesTable = async ({ supabase }) => {
  const { data: updates, error } = await supabase
    .from("updates")
    .select(
      "*, created_by (id, first_name, last_name), update_type(*), request(*, completed)"
    )
    .lte("deadline", getCurrentTimestampTZ())
    .is("request.completed", false)
    .is("request.rejected", false)
    .eq("fulfilled", false)

  return (
    <Card className="mt-6">
      <Title>Overdue tasks</Title>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Request</TableHeaderCell>
            <TableHeaderCell>Created at</TableHeaderCell>
            <TableHeaderCell>Due at</TableHeaderCell>
            <TableHeaderCell>Created by</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {updates.filter((update => update.request)).map((update) => (
            <TableRow key={update.id}>
              <TableCell>
                <Button variant="light">{update.update_type.title}</Button>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/requests/${update.request.id}`}>
                  <Button variant="light">{update.request.title}</Button>
                </Link>
              </TableCell>
              <TableCell>
                <DateFormat date={update.created_at} />
              </TableCell>
              <TableCell>
                <DateFormat date={update.deadline} />
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/users/${update.created_by.id}`}>
                  <Button variant="light">
                    {update.created_by.first_name} {update.created_by.last_name}
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                {update.deadline ? (
                  <DeadlineBadge deadline={update.deadline} />
                ) : (
                  "None"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default LateUpdatesTable;
