"use client";
import {
  Button,
  Col,
  Flex,
  Grid,
  TableCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react";
import ApprovalStatus from "./ApprovalStatus.component";
import Link from "next/link";
import LoadRequestItems from "../requests/[id]/LoadRequestItems.component";

import LoadMedia from "../requests/[id]/LoadMedia.component";
import { useState } from "react";
import { timeSince } from "@/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const ApprovalRow = ({ approval }) => {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const update = approval.update;
  const request = update.request;

  const supabase = createClientComponentClient();

  const handleReject = async () => {
    await supabase
      .from("update_approvals")
      .update({
        rejected: true,
      })
      .eq("id", approval.id);
    router.refresh();
  };

  const handleApprove = async () => {
    await supabase
      .from("update_approvals")
      .update({
        approved: true,
      })
      .eq("id", approval.id);
    router.refresh();
  };

  return (
    <>
      <TableRow>
        <TableCell>{update.update_type.title}</TableCell>
        <TableCell>{new Date(update.created_at).toLocaleString()}</TableCell>
        <TableCell>
          <Button variant="light">{approval.update.request.title}</Button>
        </TableCell>
        <TableCell>
          {approval.group.name}{" "}
          {approval.group.campus ? `(${approval.group.campus.name})` : ""}
        </TableCell>
        <TableCell>
          <ApprovalStatus approval={approval} />
        </TableCell>
        <TableCell>
          <Button variant="light" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide" : "View"} details
          </Button>
        </TableCell>
        <TableCell>
          <Flex className="gap-3" justifyContent="end">
            <Button
              color="green"
              onClick={handleApprove}
              disabled={approval.approved}
            >
              Approve
            </Button>
            <Button
              color="red"
              onClick={handleReject}
              disabled={approval.rejected}
            >
              Reject
            </Button>
          </Flex>
        </TableCell>
      </TableRow>
      {showDetails && (
        <TableRow className="h-48">
          <TableCell className="p-5 w-full" colSpan={5}>
            <Grid
              numItems={6}
              numItemsMd={4}
              numItemsLg={6}
              numItemsSm={2}
              className="gap-3 mt-6"
            >
              <Col numColSpan={6}>
                <Title>Request</Title>
              </Col>
              <Col numColSpan={2}>
                <Text>Title</Text>
                <Text className="py-2 text-black">{request.title}</Text>
              </Col>
              <Col numColSpan={2}>
                <Text>From</Text>
                <Link href={`/dashboard/users/${request.from.id}`}>
                  <Button variant="light" className="py-2">
                    {`${request.from.first_name} ${request.from.last_name} - ${
                      request.from.phone || request.from.email
                    }`}
                  </Button>
                </Link>
              </Col>
              <Col numColSpan={2}>
                <Text>Created at</Text>
                <Text className="py-2 text-black">
                  {new Date(request.created_at).toLocaleString()} (
                  {timeSince(new Date(request.created_at))} ago)
                </Text>
              </Col>
              <Col numColSpan={2}>
                <Text>Location</Text>
                <Text className="py-2 text-black">{request.location}</Text>
              </Col>
              <Col numColSpan={2}>
                <Text>Campus</Text>
                <Text className="py-2 text-black">{request.campus.name}</Text>
              </Col>
              <Col numColSpan={6}>
                <Text>Description</Text>
                <Text className="py-2 text-black">{request.description}</Text>
              </Col>
              <Col>
                <Title>Update</Title>
              </Col>
              <Col numColSpan={6}>
                <Text>Created by</Text>
                <Link href={`/dashboard/users/${update.created_by.id}`}>
                  <Button variant="light" className="py-2">
                    {update.created_by.first_name} {update.created_by.last_name}
                  </Button>
                </Link>
              </Col>

              {update.update_type.requires_deadline && (
                <Col numColSpan={6}>
                  <Text>Expected fulfill date</Text>
                  <Text className="text-black py-2">
                    {new Date(update.deadline).toLocaleDateString()}
                  </Text>
                </Col>
              )}
              {update.update_type.attach_text && (
                <Col numColSpan={6}>
                  <Text>Notes</Text>
                  <Text className="text-black py-2">{update.text}</Text>
                </Col>
              )}
              {(update.update_type.attach_request_items ||
                update.update_type.attach_existing_request_items) && (
                <Col numColSpan={6}>
                  <Text>Request items</Text>
                  <LoadRequestItems
                    equipmentRequestId={update.equipment_request}
                  />
                </Col>
              )}
              {update.update_type.attach_media && (
                <Col numColSpan={6}>
                  <LoadMedia mediaId={update.media} />
                </Col>
              )}
            </Grid>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ApprovalRow;
