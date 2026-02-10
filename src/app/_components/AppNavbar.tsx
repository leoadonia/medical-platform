"use client";

import { SidebarTrigger } from "@/components/sidebar";
import { useNavbarStore } from "@/components/sidebar/store";
import { IconButton, Tooltip } from "@mui/material";
import { Bell, ChevronRight, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const AppNavbar = () => {
  const router = useRouter();
  const { crumbs, back, jump } = useNavbarStore();

  return (
    <div className="mx-4 mt-1 flex h-10 rounded-2xl bg-white/50 shadow-lg backdrop-blur-xs">
      <div className="flex w-full items-center justify-between px-4">
        <SidebarTrigger />
        {crumbs.length > 0 && (
          <div className="mx-auto flex items-center gap-2">
            {crumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  onClick={() => {
                    if (index === crumbs.length - 1) {
                      return;
                    }

                    jump(index);
                    router.replace(crumb.href);
                  }}
                  className="border-info-50 hover:bg-info-50 rounded-xl border-2 px-2 py-0.5 text-xs hover:cursor-pointer"
                >
                  {crumb.title}
                </div>
                {index !== crumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            ))}
            {crumbs.length > 1 && (
              <Tooltip title="返回上一页">
                <IconButton
                  color="info"
                  onClick={() => {
                    const href = back();
                    console.log(href);
                    router.replace(href);
                  }}
                >
                  <Undo2 className="h-4 w-4" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        )}
        <Bell className="h-4 w-4" />
      </div>
    </div>
  );
};
