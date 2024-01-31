"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button, Col, Flex, Grid, Text } from "@tremor/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const LoadMedia = ({ mediaId }) => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const supabase = createClientComponentClient();

  const loadMediaAsync = async () => {
    const { data: mediaFiles } = await supabase
      .from("media_items")
      .select("*")
      .eq("media", mediaId);

    if(mediaFiles){
      const loadedImages = await Promise.all(
        mediaFiles.map(async (mediaFile) => {
          const { data } = await supabase.storage
            .from("media")
            .createSignedUrl(mediaFile.path, 36000);
          return data.signedUrl;
        }),
      );
      setImages(loadedImages);
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
          Show images
        </Button>
      )}
      {(!loading && images.length > 0 ) && (
        <Grid className="gap-3" numItems={2} numItemsMd={3} numItemsLg={4}>
          {/* {images.length == 0 && <Text>Loading...</Text>} */}
          {images.map((url, index) => (
            <Col key={index}>
              <Flex dir="vertical" justifyContent="center" className="h-full">
                <img alt="image" src={url} className="w-full rounded-xl" />
              </Flex>
            </Col>
          ))}
        </Grid>
      )}
      {
        (!loading && images.length == 0 ) && <div>No images!</div>
      }
    </Col>
  );
};

export default LoadMedia;
