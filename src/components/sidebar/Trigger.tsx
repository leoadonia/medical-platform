"use client";

import { IconButton } from "@mui/material";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useSidebarStore } from "./store";

export const SidebarTrigger = () => {
  const { collapsed, toggleCollapsed } = useSidebarStore();

  return (
    <IconButton
      onClick={toggleCollapsed}
      className="flex items-center rounded-full"
    >
      {collapsed ? (
        <PanelRightOpen className="h-4 w-4" />
      ) : (
        <PanelRightClose className="h-4 w-4" />
      )}
    </IconButton>
  );
};
