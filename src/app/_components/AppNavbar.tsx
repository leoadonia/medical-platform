import { SidebarTrigger } from "@/components/sidebar";
import { Bell } from "lucide-react";

export const AppNavbar = () => {
  return (
    <div className="flex h-[48] w-full items-center justify-between rounded-br-xl rounded-bl-xl bg-white p-4">
      <SidebarTrigger />
      <Bell className="h-4 w-4" />
    </div>
  );
};
