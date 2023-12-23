'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Col, Flex, Grid, Text } from "@tremor/react";
import { useEffect, useState } from "react";

const LoadMedia = ({ mediaId }) => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadMediaAsync = async () => {
      const { data: mediaFiles } = await supabase
        .from("media_items")
        .select("*")
        .eq("media", mediaId);
      console.log(mediaFiles);
      const loadedImages = await Promise.all(
        mediaFiles.map(async (mediaFile) => {
          const { data } = await supabase.storage
            .from("media")
            .createSignedUrl(mediaFile.path, 36000);
          return data.signedUrl;
        })
      );
      setImages(loadedImages);
      setLoading(false);
    };
    loadMediaAsync();
  }, []);

  return (
    <Col numColSpan={6}>
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <Grid className="gap-3" numItems={2} numItemsMd={3} numItemsLg={4}>
          {images.length == 0 && <Text>Loading...</Text>}
          {images.map((url, index) => (
            <Col key={index}>
              <Flex dir="vertical" justifyContent="center" className="h-full">
                <img src={url} className="w-full rounded-xl" />
              </Flex>
            </Col>
          ))}
        </Grid>
      )}
    </Col>
  );
};

export default LoadMedia;
