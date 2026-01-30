"use client";

import { Button, Tooltip, Typography } from "@mui/material";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackHeader = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div>
      <Tooltip title="返回">
        <Button
          variant="text"
          onClick={() => router.back()}
          startIcon={<Undo2 className="text-error-400 h-4 w-4" />}
          className="gap-2 hover:shadow-md"
        >
          <Typography variant="subtitle1" color="warning">
            {title}
          </Typography>
        </Button>
      </Tooltip>
    </div>
  );
};
