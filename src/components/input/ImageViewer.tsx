import { readImageAsset } from "@/lib/apis/assert";
import { Backdrop, Tooltip } from "@mui/material";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

export const ImageViewer = ({
  src,
  viewMode = true,
}: {
  src: string;
  viewMode?: boolean;
}) => {
  const [image, setImage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    startTransition(async () => {
      if (src) {
        const data = await readImageAsset(src);
        if (!data) {
          return;
        }

        setImage(data.asset);
      }
    });
  }, [src]);

  if (isPending) {
    return <span className="text-sm text-gray-600">加载中...</span>;
  }

  if (image) {
    return (
      <div>
        <Tooltip title="点击放大">
          <div onClick={() => setOpen(true)}>
            <Image src={image} height={100} width={90} alt={src} />
          </div>
        </Tooltip>
        {viewMode && (
          <Backdrop
            open={open}
            onClick={() => setOpen(false)}
            sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
            className="bg-gray-50/60"
          >
            <Image
              src={image}
              height={1024}
              width={1024}
              className="h-125 max-h-[60vh] w-112.5 max-w-[54vw]"
              alt={src}
            />
          </Backdrop>
        )}
      </div>
    );
  }

  return <></>;
};
