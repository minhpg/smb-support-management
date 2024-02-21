'use client';

import { Button, Select, SelectItem, TableCell, TableRow } from "@tremor/react";
import Link from "next/link";
import DeleteButton from "./DeleteButton.component";
import RequestStatus from "./RequestStatus.component";

const RequestsTableRow = ({ request }) => {
  return (
    <TableRow>
      <TableCell>
        <Link href={`/dashboard/requests/${request.id}`}>
          <Button variant="light">{request.title}</Button>
        </Link>
      </TableCell>
      <TableCell>
        {new Date(request.created_at).toLocaleString("vi-VN", {
          timezone: "Asia/Ho_Chi_Minh",
        })}
      </TableCell>
      <TableCell>
        {request.resolved_at
          ? new Date(request.resolved_at).toLocaleString("vi-VN", {
              timezone: "Asia/Ho_Chi_Minh",
            })
          : "None"}
      </TableCell>
      <TableCell>
        <Link href={`/dashboard/users/${request.from.id}`}>
          <Button variant="light">
            {request.from.first_name} {request.from.last_name}
          </Button>
        </Link>
      </TableCell>
      <TableCell>
        <RequestStatus task={request} />
      </TableCell>
      <TableCell>
        <Select
          name="priority"
          enableClear={false}
          required
          disabled
          value={request.priority.toString()}
        >
          <SelectItem value="1">Low</SelectItem>
          <SelectItem value="2">Medium</SelectItem>
          <SelectItem value="3">High</SelectItem>
        </Select>
      </TableCell>
      <TableCell>
        {request.campus ? request.campus.name : "No campus assigned"}
      </TableCell>
      <TableCell>
        <DeleteButton requestId={request.id} />
      </TableCell>
    </TableRow>
  );
};

export default RequestsTableRow;
