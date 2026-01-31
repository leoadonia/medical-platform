import { open } from "@tauri-apps/plugin-dialog";
import { ImageAsset, resolve_asset } from "./assert";

export const singleImageSelector = async (
  title?: string,
): Promise<ImageAsset | null> => {
  title = title || "选择图像文件";

  const selected = await open({
    title,
    multiple: false,
    directory: false,
    canCreateDirectories: false,
    filters: [
      {
        name: "Image file",
        extensions: ["jpg", "jpeg", "png"],
      },
    ],
  });

  if (selected) {
    console.log("selected: ", selected);
    const asset = await resolve_asset(selected);
    return {
      path: selected,
      asset,
    };
  }

  return null;
};

export const directorySelector = async (
  title?: string,
): Promise<string | null> => {
  title = title || "选择目录";

  const selected = await open({
    title,
    multiple: false,
    directory: true,
    canCreateDirectories: true,
  });

  if (selected) {
    console.log("selected: ", selected);
    return selected;
  }

  return null;
};
