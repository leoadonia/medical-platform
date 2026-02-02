import { PaginationData } from "@/lib/types/pagination";
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

export const getUsers = async (
  page?: number,
  limit?: number,
): Promise<PaginationData<User>> => {
  const users = await invoke<PaginationData<User>>("get_users", {
    page: page || 1,
    limit: limit || 10,
  });

  return users;
};

export const modifyPassword = async (
  id: number,
  password: string,
): Promise<void> => {
  await invoke("modify_password", { id, password });
};

export const addUser = async (user: User): Promise<void> => {
  await invoke("add_user", { data: JSON.stringify(user) });
};

export const deleteUser = async (id: number): Promise<void> => {
  await invoke("delete_user", { id });
};
