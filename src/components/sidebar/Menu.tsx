"use client";

import { Box, CardActionArea, Divider, Stack, Typography } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useNavbarStore } from "./store";

export type MenuGroupProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const MenuGroup = (props: MenuGroupProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <CardActionArea
        onClick={() => setCollapsed(!collapsed)}
        className="hover:text-success-500 rounded-lg p-2"
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          pl={2}
        >
          <Box display={"flex"} gap={1} alignItems={"center"}>
            {props.icon}
            <Typography variant={"subtitle2"}>{props.title}</Typography>
          </Box>
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Box>
      </CardActionArea>
      {!collapsed && (
        <Box display={"flex"} gap={0.5} pl={5}>
          <Divider orientation="vertical" flexItem />
          <Stack flex={1} spacing={1}>
            {props.children}
          </Stack>
        </Box>
      )}
    </>
  );
};

type MenuData = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

export const Menu = (props: MenuData) => {
  const { title, icon, href } = props;
  const path = usePathname();
  const router = useRouter();

  const classes = {
    active:
      "rounded-lg p-2 bg-info-100 border-2 border-white shadow-gray-400 shadow-lg text-info-700",
    inactive: "rounded-lg p-2 hover:bg-info-50",
  };

  return (
    <CardActionArea
      className={
        path === href || path.startsWith(`${href}/`)
          ? classes.active
          : classes.inactive
      }
      onClick={() => {
        useNavbarStore.getState().clear();
        useNavbarStore.getState().addRouter({ title, href });
        router.push(href);
      }}
    >
      <Box display={"flex"} alignItems={"center"} gap={2} pl={2}>
        {icon}
        <Typography variant="body2" className="font-semibold">
          {title}
        </Typography>
      </Box>
    </CardActionArea>
  );
};
