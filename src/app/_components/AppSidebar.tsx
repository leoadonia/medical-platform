"use client";

import { Menu, MenuGroup, Sidebar } from "@/components/sidebar";
import { Box, Button, Typography } from "@mui/material";
import {
  Hospital,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldQuestion,
  User,
  Users,
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
        title="主页面"
        icon={<LayoutDashboard className="h-4 w-4" />}
        href="/"
      />
      <MenuGroup title="患者管理" icon={<Hospital className="h-4 w-4" />}>
        <Menu
          title="患者信息"
          icon={<Users className="h-4 w-4" />}
          href="/patients"
        />
        <Menu
          title="问卷信息"
          icon={<ShieldQuestion className="h-4 w-4" />}
          href="/questionnaire"
        />
      </MenuGroup>
      <Menu
        title="用户管理"
        icon={<User className="h-4 w-4" />}
        href="/users"
      />
      <Menu
        title="系统设置"
        icon={<Settings className="h-4 w-4" />}
        href="/runtime"
      />
    </Box>
  );
};

const Exit = () => {
  const router = useRouter();

  const handleExit = async () => {
    // await signOut();
    router.push("/login");
  };

  return (
    <Button
      startIcon={<LogOut className="h-4 w-4" />}
      onClick={handleExit}
      color="error"
      variant="outlined"
      className="flex w-full gap-2 rounded-lg p-2" // gap-2 is used for gap between icon and text.
    >
      <Typography variant="body2">退出登录</Typography>
    </Button>
  );
};

export const AppSidebar = () => {
  return <Sidebar header={<Header />} center={<Menus />} footer={<Exit />} />;
};
