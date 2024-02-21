"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
import { useState } from "react";

import useGroups from "@/hooks/useGroups.hook";
import useCampuses from "@/hooks/useCampuses.hook";
import usePreviews from "@/hooks/usePreviews.hook";

import createRequestFormAction from "./createRequestFormAction";

const CreateRequestForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [submittedLoading, setSubmittedLoading] = useState(false);

  const campuses = useCampuses(supabase);

  const { groups } = useGroups(supabase);

  const { previews, onSelectFile } = usePreviews();

  const [selectedCampus, setSelectedCampus] = useState("");

  return (
    <>
      {submittedLoading && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-50">
            <ProgressCircle value={50} />
          </div>
        </>
      )}
      <form
        action={async (formData) => {
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
              <Button>Submit</Button>
              <Button color="red">Cancel</Button>
            </Flex>
          </Flex>
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
            <Col numColSpan={2}>
              <Text>
                Campus<span className="text-red-500">*</span>
              </Text>
              <SearchSelect
                name="campus"
                required={true}
                onChange={setSelectedCampus}
                value={selectedCampus}
              >
                {campuses.length > 0 && campuses.map((campus) => (
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
              <SearchSelect name="to" required={true} defaultValue={""}>
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
                  accept="image/*"
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
                        <img src={preview} className="w-full rounded-xl" />
                      </Flex>
                    </Col>
                  ))}
                </Grid>
              </Col>
            )}
          </Grid>
        </Card>
      </form>
    </>
  );
};

export default CreateRequestForm;
