import { SidebarTrigger } from "@/components/sidebar";
import { Bell } from "lucide-react";

export const AppNavbar = () => {
  return (
    <div className="flex h-13 w-full items-center justify-between bg-white/60 p-4 shadow-xs backdrop-blur-lg">
      <SidebarTrigger />
      <Bell className="h-4 w-4" />
    </div>
  );
};
