import { User } from "@/lib/types/user";
import { invoke } from "@tauri-apps/api/core";

export const getUserSession = async (
  name: string,
  password: string,
): Promise<User> => {
  const user = await invoke<User>("get_user_session", {
    data: JSON.stringify({ name, password }),
  });
  return user;
};
