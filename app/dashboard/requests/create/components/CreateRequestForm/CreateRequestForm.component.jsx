"use client";
import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  ProgressCircle,
  SearchSelect,
  SearchSelectItem,
  Select,
  SelectItem,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@tremor/react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import useGroups from "@/hooks/useGroups.hook";
import useCampuses from "@/hooks/useCampuses.hook";
import usePreviews from "@/hooks/usePreviews.hook";

import createRequestFormAction from "./createRequestFormAction";
import Link from "next/link";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";

const CreateRequestForm = () => {
  const { user, supabase } = useSupabaseContext();

  const router = useRouter();

  const campuses = useCampuses(supabase);

  const { groups } = useGroups(supabase);

  const { previews, selectedFiles, onSelectFile } = usePreviews();

  const [selectedCampus, setSelectedCampus] = useState(null);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.campus) {
        setSelectedCampus(user.campus.id);
      }
    }
  }, [user]);

  return (
    <form
      action={async (formData) => {
        if (!selectedGroup) {
          setErrorMessage("Error: Group not selected!");
          return;
        }
        if (!selectedCampus) {
          setErrorMessage("Error: Campus not selected!");
          return;
        }

        const response = await createRequestFormAction(formData);
        if (response) {
          router.replace("/dashboard/requests/" + response.data.id);
        }
      }}
    >
      <Card>
        <Flex>
          <Title className="w-full">New Request</Title>
          <Flex className="gap-3" justifyContent="end">
            <CreateRequestSubmitButton />
          </Flex>
        </Flex>
        {errorMessage && (
          <Text className="text-red-600 font-semibold">{errorMessage}</Text>
        )}
        <Grid
          numItems={2}
          numItemsMd={4}
          numItemsLg={6}
          numItemsSm={2}
          className="gap-3 mt-6"
        >
          <Col numColSpan={2}>
            <Text>
              Title<span className="text-red-500">*</span>
            </Text>
            <TextInput name="title" type="text" required />
          </Col>
          <Col numColSpan={2} className={user?.campus && "hidden"}>
            <Text>
              Campus<span className="text-red-500">*</span>
            </Text>
            <SearchSelect
              name="campus"
              required={true}
              onChange={setSelectedCampus}
              value={selectedCampus}
            >
              <SearchSelectItem disabled value="">
                Select one
              </SearchSelectItem>
              {campuses.length > 0 &&
                campuses.map((campus) => (
                  <SearchSelectItem value={campus.id} key={campus.id}>
                    {campus.name}
                  </SearchSelectItem>
                ))}
            </SearchSelect>
          </Col>
          <Col numColSpan={2}>
            <Text>
              To<span className="text-red-500">*</span>
            </Text>
            <SearchSelect
              name="to"
              required={true}
              value={selectedGroup}
              onChange={setSelectedGroup}
            >
              {selectedCampus &&
                groups.map((group) => {
                  if (!group.campus) return null;
                  if (group.campus.id !== selectedCampus) return null;

                  return (
                    <SearchSelectItem value={group.id} key={group.id}>
                      {`${group.name}${
                        group.campus ? ` - ${group.campus.name}` : ""
                      }`}
                    </SearchSelectItem>
                  );
                })}
              {!selectedCampus &&
                groups.map((group) => {
                  return (
                    <SearchSelectItem value={group.id} key={group.id}>
                      {`${group.name}${
                        group.campus ? ` - ${group.campus.name}` : ""
                      }`}
                    </SearchSelectItem>
                  );
                })}
            </SearchSelect>
          </Col>
          <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
            <Text>
              Description<span className="text-red-500">*</span>
            </Text>
            <Textarea
              name="description"
              type="text"
              className="h-48"
              required
            />
          </Col>
          <Col numColSpan={2}>
            <Text>Priority</Text>
            <Select
              name="priority"
              enableClear={false}
              required
              defaultValue="2"
            >
              <SelectItem value="1">Low</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">High</SelectItem>
            </Select>
          </Col>
          <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
            <Text>
              Location<span className="text-red-500">*</span>
            </Text>
            <TextInput name="location" type="text" required />
          </Col>
          <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
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
            <Col numColSpan={2} numColSpanMd={4} numColSpanLg={6}>
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
                        src={preview}
                        className="w-full rounded-xl"
                        alt={`preview-${index}`}
                      />
                    </Flex>
                  </Col>
                ))}
              </Grid>
            </Col>
          )}
          {Array.from(selectedFiles)
            .filter((selectedFile) => !selectedFile.type.includes("image"))
            .map((selectedFile) => {
              return (
                <Col
                  numColSpan={2}
                  numColSpanMd={4}
                  numColSpanLg={6}
                  key={selectedFile.name}
                >
                  <Button variant="light">{selectedFile.name}</Button>
                </Col>
              );
            })}
        </Grid>
      </Card>
      {/* <CreateRequestPendingProgress /> */}
    </form>
  );
};

const CreateRequestPendingProgress = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-50">
            <ProgressCircle value={50} />
          </div>
        </>
      )}
    </>
  );
};

const CreateRequestSubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      <Button disabled={pending}>Submit</Button>
      <Link href={"/dashboard/requests"}>
        <Button color="red" disabled={pending}>
          Cancel
        </Button>
      </Link>
    </>
  );
};

export default CreateRequestForm;
