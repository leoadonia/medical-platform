import { VideoFiles } from "@/lib/types/media";
import { invoke } from "@tauri-apps/api/core";

export const getVideo = async (): Promise<string> => {
  const video = await invoke<string>("get_video");
  return video;
};

export const getMediaDir = async (): Promise<string> => {
  const dir = await invoke<string>("get_media_dir");
  return dir;
};

export const getVideoFiles = async (): Promise<VideoFiles> => {
  return await invoke<VideoFiles>("get_videos");
};

export const enableVideo = async (video_name: string): Promise<void> => {
  await invoke("enable_video", { video_name });
};
