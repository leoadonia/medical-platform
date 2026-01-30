"use client";

import { Menu, Sidebar } from "@/components/sidebar";
import { useAuthorized, useProfileStore } from "@/lib/stores/profile";
import { Box, Button, Typography } from "@mui/material";
import {
  BedSingle,
  ChartSpline,
  LogIn,
  LogOut,
  Settings,
  ShieldQuestion,
  User,
  Users,
  Wallpaper,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  return (
    <Typography
      variant="h5"
      className="from-primary-600 to-secondary-600 bg-linear-to-r bg-clip-text text-transparent"
    >
      数据平台
    </Typography>
  );
};

const Menus = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <Menu
        title="患者信息"
        icon={<Users className="h-4 w-4" />}
        href="/patients"
      />
      <Menu
        title="临床信息"
        icon={<BedSingle className="h-4 w-4" />}
        href="/clinical"
      />
      <Menu
        title="问卷信息"
        icon={<ShieldQuestion className="h-4 w-4" />}
        href="/questionnaire"
      />
      <Menu
        title="影像学信息"
        icon={<Wallpaper className="h-4 w-4" />}
        href="/radiology"
      />
      <Menu
        title="数据管理"
        icon={<ChartSpline className="h-4 w-4" />}
        href="/data"
      />
      <Menu
        title="用户管理"
        icon={<User className="h-4 w-4" />}
        href="/users"
      />
      <Menu
        title="系统设置"
        icon={<Settings className="h-4 w-4" />}
        href="/settings"
      />
    </Box>
  );
};

const Exit = () => {
  const router = useRouter();

  const handleExit = async () => {
    useProfileStore.getState().clearProfile();
    router.push("/login");
  };

  return (
    <Button
      startIcon={<LogOut className="h-4 w-4" />}
      onClick={handleExit}
      color="error"
      variant="outlined"
      className="flex w-full gap-2 rounded-full p-2" // gap-2 is used for gap between icon and text.
    >
      <Typography variant="body2">退出登录</Typography>
    </Button>
  );
};

const Signin = () => {
  const router = useRouter();

  const handleSignin = () => {
    router.push("/login");
  };

  return (
    <Button
      startIcon={<LogIn className="h-4 w-4" />}
      onClick={handleSignin}
      variant="contained"
      className="flex w-full gap-2 rounded-full p-2" // gap-2 is used for gap between icon and text.
    >
      <Typography variant="body2">登录</Typography>
    </Button>
  );
};

export const AppSidebar = () => {
  const authorized = useAuthorized();

  return (
    <Sidebar
      header={<Header />}
      center={<Menus />}
      footer={authorized ? <Exit /> : <Signin />}
    />
  );
};
