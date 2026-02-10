import { enableVideo, getVideoFiles } from "@/lib/apis/media";
import { VideoFiles } from "@/lib/types/media";
import { Alert, Button, Chip } from "@mui/material";
import { Send, Siren } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

const Item = ({
  name,
  index,
  operator,
}: {
  name: string;
  index: number;
  operator: React.ReactNode;
}) => {
  const styles = {
    odd: "bg-pink-100 hover:bg-pink-200",
    even: "bg-warning-50 hover:bg-warning-100",
  };

  const style = index % 2 === 0 ? styles.even : styles.odd;

  return (
    <div className={`${style} flex items-center py-2`}>
      <span className="flex flex-1 justify-center font-medium">{name}</span>
      <div className="flex flex-1 justify-center">{operator}</div>
    </div>
  );
};

export const VideoTable = () => {
  const [videos, setVideos] = useState<VideoFiles>({
    names: [],
  });
  const [enabled, setEnabled] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      const files = await getVideoFiles();
      setVideos(files);
      if (files.enabled) {
        setEnabled(files.enabled);
      }
    });
  };

  const handleEnableVideo = async (video: string) => {
    try {
      await enableVideo(video);
      toast.success("视频已启用, 可至首页查看.");
      setEnabled(video);
    } catch (err) {
      toast.error(err as string);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  if (isPending) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleRefresh} className="w-10" size="small">
        刷新
      </Button>
      {videos.names.length === 0 && (
        <Alert
          color="warning"
          className="rounded-lg text-sm font-medium"
          icon={<Siren className="h-5 w-5" />}
        >
          没有视频, 请按照说明中的操作上传视频.
        </Alert>
      )}
      <div className="flex flex-col">
        {videos.names.map((name, index) => (
          <Item
            name={name}
            index={index}
            key={index}
            operator={
              enabled === name ? (
                <Chip color="success" label={"已启用"} className="px-1" />
              ) : (
                <Button
                  size="small"
                  startIcon={<Send className="h-3 w-3" />}
                  className="bg-info-200 hover:bg-info-300 gap-1 text-xs"
                  onClick={() => handleEnableVideo(name)}
                >
                  启用
                </Button>
              )
            }
          />
        ))}
      </div>
    </div>
  );
};
