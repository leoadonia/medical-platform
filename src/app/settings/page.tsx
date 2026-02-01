"use client";

import { FormGrid } from "@/components/data/FormGrid";
import { TextField } from "@/components/input/TextField";
import { directorySelector } from "@/lib/apis/selector";
import { getSettings, updateSettings } from "@/lib/apis/settings";
import { Settings } from "@/lib/types/settings";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { FolderOpen, Info } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<Settings | null>();

  useEffect(() => {
    startTransition(async () => {
      const settings = await getSettings();
      setSettings(settings);
    });
  }, []);

  const changeDataDir = async () => {
    try {
      const selected = await directorySelector("选择数据目录");
      if (selected) {
        setSettings({
          ...settings,
          data_dir: selected,
        });
      }
    } catch (err) {
      toast.error(err as string);
    }
  };

  const handleSubmit = async () => {
    if (!settings) {
      return;
    }

    try {
      await updateSettings(settings);
      toast.success("配置更新成功! 如果修改数据目录，请重启应用程序.");
    } catch (err) {
      toast.error(err as string);
    }
  };

  if (isPending) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className="text-lg font-medium text-gray-900">系统设置</div>
      <Box display={"flex"} flexDirection={"column"} gap={4} pl={8}>
        <FormGrid label="数据目录" id="data_dir">
          <div className="flex flex-col gap-1">
            <TextField
              fullWidth
              readonly
              endIcon={
                <Tooltip title="更改目录">
                  <IconButton onClick={changeDataDir}>
                    <FolderOpen className="h-4 w-4 text-pink-500" />
                  </IconButton>
                </Tooltip>
              }
              variant="standard"
              value={settings?.data_dir || ""}
            />
            <Alert
              icon={<Info className="h-5 w-5" />}
              color="warning"
              className="rounded-lg"
            >
              <Typography variant="body2" color="warning">
                请注意, 修改数据目录后, 系统不会自动拷贝数据到新目录,
                请自行拷贝.
              </Typography>
              <Typography variant="subtitle2" color="info">
                修改数据目录后, 请重启应用程序.
              </Typography>
            </Alert>
          </div>
        </FormGrid>
        <Box display={"flex"} flexDirection={"row-reverse"}>
          <Button className="bg-gray-900 text-white" onClick={handleSubmit}>
            更改配置
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SettingsPage;
