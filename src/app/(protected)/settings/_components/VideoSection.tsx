"use client";

import { getMediaDir } from "@/lib/apis/media";
import { prettyPath } from "@/lib/system";
import { Alert, Button } from "@mui/material";
import { openPath } from "@tauri-apps/plugin-opener";
import { Copy, Info } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { VideoTable } from "./VideoTable";

export const VideoSection = () => {
  const [mediaDir, setMediaDir] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const dir = await getMediaDir();
        setMediaDir(dir);
      } catch (err) {
        toast.error(err as string);
      }
    });
  }, []);

  if (isPending) {
    return <></>;
  }

  const handleOpenMediaDir = async () => {
    try {
      await openPath(mediaDir);
    } catch (err) {
      console.warn(err);
      toast.error(
        "无法打开视频目录, 请确认权限. 可打开文件管理器, 手动打开目录.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Alert
        icon={<Info className="h-5 w-5" />}
        className="items-center rounded-xl"
      >
        <div className="flex flex-col gap-2 font-medium">
          <li>
            视频需要是 <em className="text-pink-400">.mp4</em> 格式;
            视频文件的名称最好是
            <strong className="text-pink-600">不要包含</strong>
            中文、空格、特殊字符, 在一些操作系统中会访问异常.
          </li>
          <li>
            点击 <em className="text-pink-400">打开视频目录</em> 按钮,
            将视频拷贝至视频目录下.
          </li>
          <li>如果无法打开视频目录, 请拷贝视频路径, 手动打开目录.</li>
          <li>
            视频拷贝完成后, 请点击 <em className="text-pink-400">刷新</em> 按钮,
            会扫描视频目录下的文件. 选择要播放的视频, 点击{" "}
            <em className="text-pink-400">启用</em> 按钮.
          </li>
        </div>
      </Alert>
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
        当前视频目录:{" "}
        <div className="text-info-600">{prettyPath(mediaDir)}</div>
        <Button size="small" color="secondary" onClick={handleOpenMediaDir}>
          打开视频目录
        </Button>
        <CopyToClipboard text={mediaDir} onCopy={() => toast.success("已复制")}>
          <Button size="small" startIcon={<Copy className="h-3 w-3" />}>
            复制路径
          </Button>
        </CopyToClipboard>
      </div>
      <VideoTable />
    </div>
  );
};
