"use client";

import { Dialog } from "@headlessui/react";
import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  Select,
  SelectItem,
  Text,
  Title,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TextInput,
  NumberInput,
  Textarea,
  DatePicker,
} from "@tremor/react";
import { useEffect, useState } from "react";
import useUpdateTypes from "@/hooks/useUpdateTypes.hook";
import usePreviews from "@/hooks/usePreviews.hook";
import createUpdateFormAction from "./createUpdateFormAction";
import { useFormStatus } from "react-dom";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";

const useCreateUpdate = (supabase, requestId) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [updateType, setUpdateType] = useState(null);
  const [approveGroups, setApproveGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [attachRequestItems, setAttachRequestItems] = useState([]);

  const { pending } = useFormStatus();

  useEffect(() => {
    if (selectedType) {
      supabase
        .from("update_types")
        .select("*")
        .eq("id", selectedType)
        .single()
        .then(({ data }) => {
          setUpdateType(data);
        });
    }
  }, [selectedType, supabase]);

  useEffect(() => {
    if (updateType) {
      if (updateType.requires_approval) {
        supabase
          .from("approve_groups")
          .select("*, group(*, campus (name))")
          .eq("update_type", updateType.id)

          .order("index", { ascending: true })
          .then(({ data }) => {
            setApproveGroups(data);
          });
      }
    }
  }, [updateType, selectedType, supabase]);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("request", requestId);
    formData.append("update_type", updateType.id);
    formData.append("items", JSON.stringify(items));
    for (const image of mediaFiles) {
      formData.append("media[]", image);
    }
    formData.append("text", text);
    formData.append(
      "deadline",
      deadline ? deadline.toISOString().replace("T", " ").replace("Z", "") : "",
    );
    formData.append("equipment_request", attachRequestItems);

    // reset form
    await createUpdateFormAction(formData);
    setSelectedType(null);
    setUpdateType(null);
    setApproveGroups([]);
    setItems([]);
    setMediaFiles([]);
    setText("");
    setDeadline(null);
    setAttachRequestItems([]);
    setIsOpen(false);
  };

  return {
    updateType,
    selectedType,
    setSelectedType,
    approveGroups,
    items,
    setItems,
    mediaFiles,
    setMediaFiles,
    text,
    setText,
    handleSubmit,
    deadline,
    setDeadline,
    attachRequestItems,
    setAttachRequestItems,
    isOpen,
    setIsOpen,
    pending,
  };
};

const CreateUpdate = ({ requestId, campusId }) => {
  const { supabase } = useSupabaseContext();
  const types = useUpdateTypes(supabase, campusId);

  const {
    updateType,
    selectedType,
    setSelectedType,
    approveGroups,
    items,
    setItems,
    text,
    setText,
    // mediaFiles,
    setMediaFiles,
    handleSubmit,
    deadline,
    setDeadline,
    setAttachRequestItems,
    isOpen,
    setIsOpen,
    pending,
  } = useCreateUpdate(supabase, requestId);

  const { previews, onSelectFile, selectedFiles } = usePreviews();

  useEffect(() => {
    setMediaFiles(selectedFiles);
  }, [selectedFiles, setMediaFiles]);

  return (
    <>
      <Button variant="light" onClick={() => setIsOpen(true)}>
        Create update
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full w-3/4 md:w-5/6">
            <Card>
              <Flex>
                <Title>Create new update</Title>
                <Button
                  color="red"
                  variant="light"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </Flex>
              <Grid numItems={2} className="mt-6 gap-3">
                <Col numColSpan={1}>
                  <Text>Type</Text>
                  <Select
                    name="update_type"
                    onChange={setSelectedType}
                    value={selectedType}
                  >
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </Select>
                </Col>
                {updateType && (
                  <>
                    {updateType.requires_approval && (
                      <Col numColSpan={2}>
                        <Text>Requires approval from</Text>
                        <Table>
                          <TableBody>
                            {approveGroups.map(({ group }, index) => (
                              <TableRow key={group.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>
                                  {group.campus ? group.campus.name : ""}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Col>
                    )}
                    {updateType.requires_deadline && (
                      <Col numColSpan={2}>
                        <Text>Expected fulfill date</Text>
                        <DatePicker
                          value={deadline}
                          onValueChange={setDeadline}
                        />
                      </Col>
                    )}
                    {updateType.attach_text && (
                      <Col numColSpan={2}>
                        <Text>Comments</Text>
                        <Textarea
                          className="h-48"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </Col>
                    )}
                    {updateType.attach_media && (
                      <>
                        <Col numColSpan={2}>
                          <Text>Attach media</Text>
                          <Text>
                            <input
                              type="file"
                              name="image[]"
                              multiple
                              onChange={onSelectFile}
                            />
                          </Text>
                        </Col>
                        {previews.length > 0 && (
                          <Col numColSpan={2}>
                            <Grid
                              className="gap-3"
                              numItems={2}
                              numItemsMd={3}
                              numItemsLg={4}
                            >
                              {previews.map((preview, index) => (
                                <Col key={index}>
                                  <Flex
                                    dir="vertical"
                                    justifyContent="center"
                                    className="h-full"
                                  >
                                    <img
                                      alt="preview"
                                      src={preview}
                                      className="w-full rounded-xl"
                                    />
                                  </Flex>
                                </Col>
                              ))}
                            </Grid>
                          </Col>
                        )}
                        {Array.from(selectedFiles)
                          .filter(
                            (selectedFile) =>
                              !selectedFile.type.includes("image"),
                          )
                          .map((selectedFile) => {
                            return (
                              <Col numColSpan={2} key={selectedFile.name}>
                                <Button variant="light">
                                  {selectedFile.name}
                                </Button>
                              </Col>
                            );
                          })}
                      </>
                    )}
                    {updateType.attach_request_items && (
                      <Col numColSpan={2}>
                        <Text>Request items</Text>
                        <NewRequestItemList items={items} setItems={setItems} />
                      </Col>
                    )}
                    {updateType.attach_existing_request_items && (
                      <Col numColSpan={2}>
                        <Text>Select items list</Text>
                        <SelectRequestItemList
                          requestId={requestId}
                          setAttachRequestItems={setAttachRequestItems}
                        />
                      </Col>
                    )}
                  </>
                )}
                <Col numColSpan={2}>
                  <Flex justifyContent="end">
                    <Button onClick={handleSubmit} disabled={pending}>
                      Submit
                    </Button>
                  </Flex>
                </Col>
              </Grid>
            </Card>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

const NewRequestItemList = ({ items, setItems }) => {
  const handleAddListItem = () => {
    setItems([
      ...items,
      {
        name: "",
        amount: 0,
      },
    ]);
  };

  const handleDeleteListItem = (index) => {
    const copy = [...items];
    copy.splice(index, 1);
    setItems(copy);
  };

  const handleUpdateName = (index, value) => {
    const copy = [...items];
    copy[index].name = value;
    setItems(copy);
  };

  const handleUpdateAmount = (index, value) => {
    const copy = [...items];
    copy[index].amount = value;
    setItems(copy);
  };

  return (
    <Table>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <TextInput
                value={item.name}
                onChange={(e) => handleUpdateName(index, e.target.value)}
              />
            </TableCell>
            <TableCell>
              <NumberInput
                value={item.amount}
                onChange={(e) => handleUpdateAmount(index, e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button
                color="red"
                onClick={() => handleDeleteListItem(index)}
                variant="light"
                className="w-full"
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={3}>
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleAddListItem}
            >
              +
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const SelectRequestItemList = ({ requestId, setAttachRequestItems }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [lists, setLists] = useState([]);
  const [list, setList] = useState(null);

  const { supabase } = useSupabaseContext();

  useEffect(() => {
    supabase
      .from("equipment_requests")
      .select("*")
      .eq("request", requestId)
      .then(({ data: equipmentLists }) => {
        setLists(equipmentLists);
      });
  }, [supabase, requestId]);

  useEffect(() => {
    const loadItemsAsync = async () => {
      const { data: requestItems } = await supabase
        .from("equipment_request_items")
        .select("*")
        .eq("equipment_request", list);
      setItems(requestItems);
      setLoading(false);
    };
    if (list) {
      loadItemsAsync();
    }
  }, [list, supabase]);

  return (
    <>
      <Select
        onChange={(value) => {
          setList(value);
          setAttachRequestItems(value);
        }}
      >
        {lists.map((itemList) => (
          <SelectItem key={itemList.id} value={itemList.id}>
            {itemList.id}
          </SelectItem>
        ))}
      </Select>
      {list && (
        <>
          {loading && <Text>Loading...</Text>}
          {!loading && (
            <Table>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>#{index + 1}</TableCell>
                    <TableCell>
                      <TextInput value={item.name} disabled />
                    </TableCell>
                    <TableCell>
                      <NumberInput value={item.amount} disabled />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default CreateUpdate;
