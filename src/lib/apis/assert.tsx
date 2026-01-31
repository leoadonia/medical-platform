import { invoke } from "@tauri-apps/api/core";

export interface ImageAsset {
  path: string;
  asset: string;
}

export const resolve_asset = async (path: string): Promise<string> => {
  return await invoke<string>("resolve_asset", { path });
};

export const readImageAsset = async (
  path: string,
): Promise<ImageAsset | null> => {
  if (!path) {
    return null;
  }

  const asset = await resolve_asset(path);
  return {
    path,
    asset,
  };
};
