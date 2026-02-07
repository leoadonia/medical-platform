import { invoke } from "@tauri-apps/api/core";

export const getVideo = async (): Promise<string> => {
  const video = await invoke<string>("get_video");
  return video;
};
