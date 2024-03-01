import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionList,
  Badge,
  Button,
  Flex,
  Text,
} from "@tremor/react";

import LoadMedia from "./LoadMedia.component";
import LoadRequestItems from "./LoadRequestItems.component";
import LoadApprovals from "./LoadApprovals.component";
import DeadlineBadge from "../../components/DeadlineBadge.component";
import UpdateActions from "./UpdateActions.component";

import Link from "next/link";
import DateFormat from "../../../components/DateFormat.component";

const LoadUpdate = async ({ supabase, request }) => {
  const requestLocked = request.completed || request.rejected
  const { data: updates } = await supabase
    .from("updates")
    .select("*, update_type (*), created_by (*)")
    .eq("request", request.id)
    .order("created_at", { ascending: true });

  if (updates.length == 0) {
    return <Text>No updates yet!</Text>;
  }

  return (
    <>
      <AccordionList>
        {updates.map((update) => (
          <Accordion key={update.id}>
            <AccordionHeader>
              <Flex>
                <div>
                  {update.update_type.title} -{" "}
                  <DateFormat date={update.created_at} />
                </div>
                {update.update_type.requires_deadline && (
                  <>
                    {update.fulfilled ? (
                      <Badge color="green">Fulfilled</Badge>
                    ) : (
                      <DeadlineBadge deadline={update.deadline} />
                    )}
                  </>
                )}
              </Flex>
            </AccordionHeader>
            <AccordionBody>
              {
                <div>
                  <Text>Created by</Text>
                  <Link href={`/dashboard/users/${update.created_by.id}`}>
                    <Button variant="light">
                      {update.created_by.first_name}{" "}
                      {update.created_by.last_name}
                    </Button>
                  </Link>
                </div>
              }
              {update.update_type.requires_deadline && (
                <div className="mt-3">
                  <Text>Expected fulfill date</Text>
                  <Text className="text-black">
                    <DateFormat date={update.deadline} />
                  </Text>
                </div>
              )}
              {update.update_type.attach_text && (
                <div className="mt-3">
                  <Text>Notes</Text>
                  <Text className="text-black whitespace-pre-wrap">
                    {update.text}
                  </Text>
                </div>
              )}
              {update.update_type.requires_approval && (
                <div className="mt-3">
                  <Text>Approvals</Text>
                  <LoadApprovals updateId={update.id} />
                </div>
              )}
              {(update.update_type.attach_request_items ||
                update.update_type.attach_existing_request_items) && (
                <div className="mt-3">
                  <Text>Request items</Text>
                  {update.equipment_request ? (
                    <LoadRequestItems
                      equipmentRequestId={update.equipment_request}
                    />
                  ) : (
                    <Text className="text-black py-2">No items attached!</Text>
                  )}
                </div>
              )}
              {update.update_type.attach_media && update.media && (
                <div className="mt-3">
                  <LoadMedia mediaId={update.media} />
                </div>
              )}
              <UpdateActions update={update} requestLocked={requestLocked} />
            </AccordionBody>
          </Accordion>
        ))}
      </AccordionList>
    </>
  );
};

export default LoadUpdate;
