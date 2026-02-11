import { Backdrop, Tooltip } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export const ImageViewer = ({ src }: { src: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  if (!src) {
    return <></>;
  }

  return (
    <div>
      <Tooltip title="点击放大">
        <div onClick={() => setOpen(true)}>
          <Image src={src} height={100} width={90} alt="#" />
        </div>
      </Tooltip>
      <Backdrop
        open={open}
        onClick={() => setOpen(false)}
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        className="bg-gray-50/60"
      >
        <Image
          src={src}
          height={1024}
          width={1024}
          className="h-125 max-h-[60vh] w-112.5 max-w-[54vw]"
          alt="#"
        />
      </Backdrop>
    </div>
  );
};
