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

const LateUpdatesTable = async () => {
  const { supabase } = await getSession();
  const { data: updates } = await supabase
    .from("updates")
    .select(
      "*, created_by (id, first_name, last_name), update_type(*), request(*)"
    )
    .eq("fulfilled", false)
    .lte('deadline', getCurrentTimestampTZ())

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
          {updates.map((update) => (
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
                {new Date(update.created_at).toLocaleString("vi-VN", { timezone: "Asia/Ho_Chi_Minh" })}
              </TableCell>
              <TableCell>
                {update.deadline
                  ? new Date(update.deadline).toLocaleString("vi-VN", { timezone: "Asia/Ho_Chi_Minh" })
                  : "None"}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/users/${update.created_by.id}`}>
                  <Button variant="light">
                    {update.created_by.first_name} {update.created_by.last_name}
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                { update.deadline ? <DeadlineBadge deadline={update.deadline} /> : "None"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default LateUpdatesTable;
