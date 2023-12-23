import getSession from "@/supabase/getSession";
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
import RequestStatus from "@/app/dashboard/requests/RequestStatus.component";
import LoadMedia from "./LoadMedia.component";
import LoadUpdate from "./LoadUpdate.component";
import CreateUpdate from './CreateUpdate.component'
import ChangeRequestStatus from "./ChangeRequestStatus.component";
import DeleteButton from "../DeleteButton.component";
import Link from "next/link";
import { timeSince } from "@/utils";

const DashboardUpdateRequestPage = async ({ params }) => {
  const { supabase } = await getSession();
  const { data: request, error } = await supabase
    .from("requests")
    .select(
      "*, from(id, first_name, last_name, email, phone), campus (id, name)"
    )
    .eq("id", params.id)
    .single();
  
  console.log(error)
    
  if(!request){
    return <Text>Request not found!</Text>
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
          <DeleteButton requestId={request.id} />
        </Flex>
        <Grid
          numItems={6}
          numItemsMd={4}
          numItemsLg={6}
          numItemsSm={2}
          className="gap-3 mt-6"
        >
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
            <Text>To</Text>
            <Flex className="py-2">
              {respondGroupMembers.map((respondGroup) => (
                <Badge key={respondGroup.group.id}>
                  {respondGroup.group.name} - {respondGroup.group.campus.name}
                </Badge>
              ))}
            </Flex>
          </Col>
          <Col numColSpan={6}>
            <Text>Description</Text>
            <Text className="py-2 text-black">{request.description}</Text>
          </Col>
          {request.media && <LoadMedia mediaId={request.media} />}
          <Col numColSpan={6}>
            <Flex justifyContent="end" className="gap-3">
              <ChangeRequestStatus requestId={request.id} />
            </Flex>
          </Col>
        </Grid>
      </Card>
      <Card className="mt-6">
        <Flex>
          <Title>Updates</Title>
          { !(request.completed || request.rejected) && <CreateUpdate requestId={request.id} />}
        </Flex>
        <div className="mt-6">
        <LoadUpdate supabase={supabase} requestId={request.id} requestLocked={request.completed || request.rejected}/>
        </div>
      </Card>
    </>
  );
};

export default DashboardUpdateRequestPage;
