import { Settings } from "@/lib/types/settings";
import { invoke } from "@tauri-apps/api/core";

export const getSettings = async (): Promise<Settings> => {
  return await invoke("get_settings");
};

export const updateSettings = async (settings: Settings): Promise<void> => {
  return await invoke("update_settings", {
    data: JSON.stringify(settings),
  });
};
