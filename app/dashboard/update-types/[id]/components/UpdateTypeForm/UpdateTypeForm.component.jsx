"use client";

import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  SearchSelect,
  SearchSelectItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@tremor/react";

import updateUpdateTypeFormAction from "./updateUpdateTypeFormAction";
import updateUpdateTypeGroupsAction from "./updateUpdateTypeGroupsAction";
import { useEffect, useState } from "react";
import useCampuses from "@/hooks/useCampuses.hook";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";

const UpdateTypeForm = ({ updateType: initUpdateType }) => {

  const [updateType, setUpdateType] = useState(initUpdateType);
  const [saved, setSaved] = useState(true);
  
  const {supabase} = useSupabaseContext();
  const campuses = useCampuses(supabase);

  const [campus, setCampus] = useState(initUpdateType.campus);

  useEffect(() => {
    setCampus(updateType.campus);
  }, [updateType]);

  return (
    <>
      <form
        action={async (formData) => {
          const { data: newUpdateType } = await updateUpdateTypeFormAction(
            formData
          );
          setUpdateType(newUpdateType);
          setSaved(true);
        }}
        onChange={() => setSaved(false)}
        className="mt-6"
      >
        <Card>
          <Flex>
            <Flex justifyContent="between" className="gap-3">
              <Title>Update type - {updateType.id}</Title>
              <Text>{saved ? "Saved" : "Not saved"}</Text>
              <input
                name="id"
                value={updateType.id}
                className="hidden"
                aria-hidden
              />
            </Flex>
          </Flex>
          <Grid
            numItems={6}
            numItemsMd={4}
            numItemsLg={6}
            numItemsSm={3}
            className="gap-3 mt-6"
          >
            <Col numColSpan={6}>
              <Text>Title</Text>
              <TextInput
                name="title"
                type="text"
                defaultValue={updateType.title}
              />
            </Col>
            <Col numColSpan={6}>
              <Text>Description</Text>
              <Textarea
                defaultValue={updateType.description}
                name="description"
                className="h-48"
              />
            </Col>
            <Col numColSpan={2}>
              <Text>Requires approval</Text>
              <input
                type="checkbox"
                name="requires_approval"
                defaultChecked={updateType.requires_approval}
                value={true}
              />
            </Col>
            <Col numColSpan={2}>
              <Text>Requires deadline</Text>
              <input
                type="checkbox"
                name="requires_deadline"
                defaultChecked={updateType.requires_deadline}
                value={true}
              />
            </Col>
            <Col numColSpan={2}>
              <Text>Attach items list</Text>
              <input
                type="checkbox"
                name="attach_request_items"
                defaultChecked={updateType.attach_request_items}
                value={true}
              />
            </Col>
            <Col numColSpan={2}>
              <Text>Attach existing items list</Text>
              <input
                type="checkbox"
                name="attach_existing_request_items"
                defaultChecked={updateType.attach_existing_request_items}
                value={true}
              />
            </Col>
            <Col numColSpan={2}>
              <Text>Attach media</Text>
              <input
                type="checkbox"
                name="attach_media"
                defaultChecked={updateType.attach_media}
                value={true}
              />
            </Col>
            <Col numColSpan={2}>
              <Text>Attach text</Text>
              <input
                type="checkbox"
                name="attach_text"
                defaultChecked={updateType.attach_text}
                value={true}
              />
            </Col>
            <Col numColSpan={3}>
              <Text>Campus</Text>
              <SearchSelect name="campus" defaultValue={updateType.campus}>
                {campuses.map((campus) => (
                  <SearchSelectItem value={campus.id} key={campus.id}>
                    {campus.name}
                  </SearchSelectItem>
                ))}
              </SearchSelect>
            </Col>
            <Col numColSpan={6}>
              <Flex justifyContent="end">
                <Button>Save</Button>
              </Flex>
            </Col>
          </Grid>
        </Card>
      </form>
      {updateType.requires_approval && (
        <UpdateTypeFormEditGroup
          supabase={supabase}
          key={campus}
          campusId={campus}
          updateTypeId={updateType.id}
        />
      )}
    </>
  );
};

const UpdateTypeFormEditGroup = ({ supabase, campusId, updateTypeId }) => {
  const [groupsLoading, setGroupsLoading] = useState(true);

  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [saved, setSaved] = useState(true);

  useEffect(() => {
    let query = supabase
    .from("groups")
    .select("*, campus (name)")
    if(campusId){
      console.log(campusId)
      query.eq('campus', campusId)
    }

    query.then(({ data }) => {
      if (data) setAvailableGroups(data);
      setGroupsLoading(false);
    });
  }, [campusId, supabase]);

  useEffect(() => {
    if (!groupsLoading) {
      supabase
        .from("approve_groups")
        .select("*, group (*, campus (name))")
        .eq("update_type", updateTypeId)
        .order("index", { ascending: true })
        .then(({ data }) => {
          const approveGroups = data.map((group) => group.group);
          const approveIds = approveGroups.map((group) => group.id);
          const availableGroupsFiltered = availableGroups.filter(
            (x) => !approveIds.includes(x.id)
          );
          setAvailableGroups(availableGroupsFiltered);
          setSelectedGroups(approveGroups);
        });
    }
  }, [groupsLoading, updateTypeId]);

  const handleAddGroup = (group) => {
    setSaved(false);
    setSelectedGroups([...selectedGroups, group]);
    setAvailableGroups(
      availableGroups.filter((availableGroup) => availableGroup.id !== group.id)
    );
  };

  const handleDeleteGroup = (group) => {
    setSaved(false);
    setSelectedGroups(
      selectedGroups.filter((selectedGroup) => selectedGroup.id !== group.id)
    );
    setAvailableGroups([...availableGroups, group]);
  };

  const handleMoveUp = (index) => {
    const newArray = [...selectedGroups];
    if (index - 1 < 0) return;
    const item = selectedGroups[index];
    const prev = selectedGroups[index - 1];
    newArray[index] = prev;
    newArray[index - 1] = item;
    setSaved(false);
    setSelectedGroups(newArray);
  };

  const handleMoveDown = (index) => {
    const newArray = [...selectedGroups];
    if (index + 1 > selectedGroups.length) return;
    const item = selectedGroups[index];
    const next = selectedGroups[index + 1];
    newArray[index] = next;
    newArray[index + 1] = item;
    setSaved(false);
    setSelectedGroups(newArray);
  };

  const handleSubmit = async () => {
    const data = await updateUpdateTypeGroupsAction({
      updateTypeId,
      selectedGroups,
    });
    setSaved(true);
  };

  return (
    <Card className="mt-6">
      <Flex className="px-2">
        <Title>Selected Groups</Title>
        <Text>{saved ? "Saved" : "Not saved"}</Text>
      </Flex>
      {selectedGroups.length == 0 ? (
        <Text className="mx-2">No groups selected</Text>
      ) : (
        <Text className="mx-2">
          Order groups by ranking (highest to lowest)
        </Text>
      )}
      <Table>
        <TableBody>
          {selectedGroups.map((group, index) => (
            <TableRow key={group.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.campus ? group.campus.name : "None"}</TableCell>
              <TableCell>
                <Flex justifyContent="center" className="gap-3">
                  <Button
                    variant="light"
                    onClick={() => handleMoveUp(index)}
                    disabled={index == 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 15.75l7.5-7.5 7.5 7.5"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => handleMoveDown(index)}
                    disabled={index == selectedGroups.length - 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </Button>
                </Flex>
              </TableCell>
              <TableCell>
                <Button
                  variant="light"
                  color="red"
                  className="w-full"
                  onClick={() => handleDeleteGroup(group)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6">
        <Title className="mx-2">Available groups</Title>
        {!groupsLoading && availableGroups.length == 0 && (
          <Text className="mx-2">No groups available</Text>
        )}
        {groupsLoading && <Text className="mx-2">Loading groups...</Text>}
        {!groupsLoading && (
          <Table>
            <TableBody>
              {availableGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>
                    {group.campus ? group.campus.name : "None"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="light"
                      onClick={() => handleAddGroup(group)}
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Flex justifyContent="end">
        <Button onClick={handleSubmit}>Save</Button>
      </Flex>
    </Card>
  );
};

export default UpdateTypeForm;
