import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Grid,
  Text,
  Title,
} from "@tremor/react";
import Link from "next/link";

import RequestStatus from "@/app/dashboard/requests/components/RequestStatus.component";
import LoadMedia from "./components/LoadMedia.component";
import LoadUpdate from "./components/LoadUpdate.component";
import CreateUpdate from "./components/CreateUpdate";
import ChangeRequestStatus from "./components/ChangeRequestStatus.component";
import DeleteButton from "@/app/dashboard/requests/components/DeleteButton.component";

import { timeSince } from "@/utils";
import getUserProfile from "@/supabase/getUserProfile";
import DateFormat from "../../components/DateFormat.component";
import Loading from "../../loading";
import { Suspense } from "react";
import { redirect } from "next/navigation";

const DashboardUpdateRequestPage = async ({ params }) => {
  const { supabase, user } = await getUserProfile();

  const { data: request, error } = await supabase
    .from("requests")
    .select(
      "*, from(id, first_name, last_name, email, phone), campus (id, name)"
    )
    .eq("id", params.id)
    .single();

  let allowCreateUpdate = true;
  let allowDeleteRequest = true;

  if (user.role.permission_level == "USER") allowCreateUpdate = false;
  if (user.role.permission_level == "MODERATOR") allowDeleteRequest = false;

  if (!request) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-center">
            <div>
              <Title>Request not found!</Title>
              <Link href="/dashboard/requests">
                <Button variant="light">
                  <Flex>
                    Visit dashboard{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Flex>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: respondGroupMembers } = await supabase
    .from("respond_group_members")
    .select("*, group (id, name, campus (name))")
    .eq("respond_group", request.to);

  return (
    <>
      <Card>
        <Flex justifyContent="between">
          <Flex justifyContent="start" className="gap-3">
            <Title>Request #{params.id}</Title>
            <RequestStatus task={request} />
          </Flex>
          {allowDeleteRequest && <DeleteButton requestId={request.id} />}
        </Flex>
        <div className="lg:grid grid-cols-6 gap-3 mt-6">
          <Col numColSpan={2}>
            <Text>Title</Text>
            <Text className="py-2 text-black">{request.title}</Text>
          </Col>
          <Col numColSpan={2}>
            <Text>From</Text>
            <Link href={`/dashboard/users/${request.from.id}`}>
              <Button variant="light" className="py-2">
                {`${request.from.first_name} ${request.from.last_name}`}
              </Button>
            </Link>
          </Col>
          <Col numColSpan={2}>
            <Text>Created at</Text>
            <Text className="py-2 text-black">
              <DateFormat date={request.created_at} /> (
              {timeSince(new Date(request.created_at))} ago)
            </Text>
          </Col>
          <Col numColSpan={2}>
            <Text>Location</Text>
            <Text className="py-2 text-black">{request.location}</Text>
          </Col>
          <Col numColSpan={2}>
            <Text>Campus</Text>
            <Text className="py-2 text-black">
              {request.campus ? request.campus.name : "None"}
            </Text>
          </Col>

          <Col
            numColSpan={2}
            numColSpanSm={2}
            numColSpanMd={4}
            numColSpanLg={6}
          >
            <Text>To</Text>
            <Flex className="py-2 overflow-scroll">
              {respondGroupMembers.map((respondGroup) => (
                <Badge key={respondGroup.group.id}>
                  {respondGroup.group.name} - {respondGroup.group.campus.name}
                </Badge>
              ))}
              {respondGroupMembers.length == 0 && (
                <Text className="py-2 text-black">None</Text>
              )}
            </Flex>
          </Col>
          <Col
            numColSpan={2}
            numColSpanSm={2}
            numColSpanMd={4}
            numColSpanLg={6}
          >
            <Text>Description</Text>
            <Text className="py-2 text-black whitespace-pre-wrap">
              {request.description}
            </Text>
          </Col>
          {request.media && <LoadMedia mediaId={request.media} />}
          <Col
            numColSpan={2}
            numColSpanSm={2}
            numColSpanMd={4}
            numColSpanLg={6}
            className="mt-6 lg:mt-0"
          >
            <Flex justifyContent="end" className="gap-3 flex-wrap">
              <ChangeRequestStatus requestId={request.id} />
            </Flex>
          </Col>
        </div>
      </Card>
      <Card className="mt-6">
        <Flex>
          <Title>Updates</Title>
          {!(request.completed || request.rejected) && (
            <>
              {allowCreateUpdate && (
                <CreateUpdate
                  requestId={request.id}
                  campusId={request.campus ? request.campus.id : null}
                />
              )}
            </>
          )}
        </Flex>
        <div className="mt-6">
          <Suspense fallback={<Loading />}>
            <LoadUpdate
              supabase={supabase}
              request={request}
            />
          </Suspense>
        </div>
      </Card>
    </>
  );
};

export default DashboardUpdateRequestPage;
