"use client";

import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";
import { Button, Col, Flex, Grid } from "@tremor/react";
import Link from "next/link";
import { useState } from "react";

const LoadMedia = ({ mediaId }) => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [docs, setDocs] = useState([]);

  const { supabase } = useSupabaseContext();

  const loadMediaAsync = async () => {
    const { data: mediaFiles } = await supabase
      .from("media_items")
      .select("*")
      .eq("media", mediaId);

    console.log(mediaFiles);

    if (mediaFiles) {
      const loadedImages = await Promise.all(
        mediaFiles
          .filter((file) => file.type.includes("image"))
          .map(async (mediaFile) => {
            const { data } = await supabase.storage
              .from("media")
              .createSignedUrl(mediaFile.path, 36000);
            return data.signedUrl;
          })
      );

      const loadedDocuments = await Promise.all(
        mediaFiles
          .filter((file) => !file.type.includes("image"))
          .map(async (mediaFile) => {
            const { data, error } = await supabase.storage
              .from("media")
              .createSignedUrl(mediaFile.path, 36000);
            console.log(data, error);
            return {
              url: data.signedUrl,
              name: mediaFile.name,
            };
          })
      );
      setImages(loadedImages);
      setDocs(loadedDocuments);
    }
    setLoading(false);
  };

  // useEffect(() => {

  //   loadMediaAsync();
  // }, []);

  return (
    <Col numColSpan={6}>
      {loading && (
        <Button onClick={loadMediaAsync} variant="light">
          Show attachments
        </Button>
      )}
      {!loading && images.length > 0 && (
        <Grid className="gap-3" numItems={2} numItemsMd={3} numItemsLg={4}>
          {/* {images.length == 0 && <Text>Loading...</Text>} */}
          {images.map((url, index) => (
            <Col key={index}>
              <Flex dir="vertical" justifyContent="center" className="h-full">
                <img alt="image" src={url} className="w-full rounded-xl" />
              </Flex>
            </Col>
          ))}
          {docs.map((doc) => {
            return (
              <Col
                numColSpan={2}
                numColSpanMd={4}
                numColSpanLg={6}
                key={doc.name}
              >
                <Link href={doc.url} target="_blank">
                  <Button variant="light">{doc.name}</Button>
                </Link>
              </Col>
            );
          })}
        </Grid>
      )}
      {!loading && images.length == 0 && <div>No attachments!</div>}
    </Col>
  );
};

export default LoadMedia;
