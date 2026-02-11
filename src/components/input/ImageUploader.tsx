"use client";

import { readImageAsset } from "@/lib/apis/assert";
import { singleImageSelector } from "@/lib/apis/selector";
import {
  Box,
  Card,
  CardActionArea,
  CircularProgress,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";
import { ImageUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

export const ImageUploader = (props: {
  title: string;
  example: string;
  src: string;
  onImageSelected: (src: string) => void;
}) => {
  const { title, example, src, onImageSelected } = props;
  const [image, setImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      if (src.startsWith("http://")) {
        setImage(src);
        return;
      }

      const image = await readImageAsset(src);
      if (image) {
        setImage(image.asset);
      }
    });
  }, [src]);

  const openImageSelector = async () => {
    const selected = await singleImageSelector(`请选择 ${title} 图片.`);
    if (selected) {
      setImage(selected.asset);
      onImageSelected(selected.path);
    }
  };

  if (isPending) {
    return <CircularProgress color="info" />;
  }

  return (
    <Card className="shadow-info-50 border-info-50 border bg-white/30 shadow-lg">
      <div className="p-2 px-8">
        <Grid container spacing={2} alignItems={"center"}>
          <Grid size={2}>
            <FormLabel>
              <Typography variant="subtitle1">{title}:</Typography>
            </FormLabel>
          </Grid>
          <Grid>
            <Box display={"flex"} gap={4}>
              <Image
                src={example}
                height={200}
                width={180}
                alt={`${title}示例`}
              />
              <CardActionArea onClick={openImageSelector}>
                {image ? (
                  <Image src={image} height={200} width={180} alt={title} />
                ) : (
                  <div className="flex h-50 w-45 items-center justify-center rounded-md border border-white shadow-lg">
                    <ImageUp color="gray" className="h-12 w-12" />
                  </div>
                )}
              </CardActionArea>
            </Box>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};
