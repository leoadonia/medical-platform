"use client";

import { BackHeader } from "@/components/BackHeader";
import { ImageUploader } from "@/components/input/ImageUploader";
import {
  insertRadiology,
  updateRadiology as updateRadiologyCommand,
} from "@/lib/apis/radiology";
import { useRadiologyStore } from "@/lib/stores/radiology";
import { Alert, Button, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const RadiologyEditPage = () => {
  const router = useRouter();
  const { radiology, updateRadiology } = useRadiologyStore();

  const handleSubmit = async () => {
    try {
      if (radiology.id === 0) {
        await insertRadiology(radiology);
      } else {
        await updateRadiologyCommand(radiology);
      }

      toast.success("上传成功!");
      router.replace("/radiology");
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <BackHeader title={radiology.id === 0 ? "新增" : "编辑"} />
      <Alert
        icon={<Info className="h-4 w-4" />}
        severity="info"
        className="items-center rounded-xl px-4"
      >
        <Typography variant="subtitle2" className="text-info-600 font-semibold">
          请按照示例图片分别上传 X片 和 体态照片 (前后左右各一张),
          左侧为示例图片.
        </Typography>
      </Alert>

      <ImageUploader
        title="X光片"
        example="/x-ray.png"
        src={radiology.x_ray}
        onImageSelected={(src) => updateRadiology({ x_ray: src })}
      />
      <ImageUploader
        title="体态(前)"
        example="/posture-frontend.png"
        src={radiology.posture_frontend}
        onImageSelected={(src) => updateRadiology({ posture_frontend: src })}
      />
      <ImageUploader
        title="体态(后)"
        example="/posture-backend.png"
        src={radiology.posture_backend}
        onImageSelected={(src) => updateRadiology({ posture_backend: src })}
      />
      <ImageUploader
        title="体态(左)"
        example="/posture-left.png"
        src={radiology.posture_left}
        onImageSelected={(src) => updateRadiology({ posture_left: src })}
      />
      <ImageUploader
        title="体态(右)"
        example="/posture-right.png"
        src={radiology.posture_right}
        onImageSelected={(src) => updateRadiology({ posture_right: src })}
      />

      <Button
        className="from-primary-200 to-info-400 mx-auto mt-8 flex min-w-3xs bg-linear-to-r text-white"
        onClick={handleSubmit}
      >
        确定
      </Button>
    </div>
  );
};

export default RadiologyEditPage;
