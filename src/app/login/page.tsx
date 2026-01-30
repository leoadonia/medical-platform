"use client";

import { PasswordField } from "@/components/input/PasswordField";
import { TextField } from "@/components/input/TextField";
import { getUserSession } from "@/lib/apis/user";
import { Profile, useProfileStore } from "@/lib/stores/profile";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const signin = async (
  name: string,
  password: string,
): Promise<Profile | null> => {
  try {
    const user = await getUserSession(name, password);
    toast.success("登录成功");

    const now = new Date();
    now.setDate(now.getDate() + 7);
    const profile: Profile = {
      ...user,
      expires_at: now.getTime(),
    };

    return profile;
  } catch (err) {
    toast.error(err as string);
  }

  return null;
};

const Login = () => {
  const params = useSearchParams();
  const redirectTo = params.get("callbackUrl") || "/";

  const router = useRouter();
  const { setProfile } = useProfileStore();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const profile = await signin(name, password);
    if (profile) {
      setProfile(profile);
      router.push(redirectTo);
    }
  };

  return (
    <div className="flex h-full items-center justify-center pb-20">
      <Card className="border-primary-100 w-md rounded-2xl border bg-white/80 p-8 shadow-lg">
        <Box component={"form"} noValidate onSubmit={handleLogin}>
          <CardContent className="flex flex-col gap-4 text-center">
            <Typography variant="h4" color="success" className="pb-4">
              脊柱侧弯矫正 - 科研平台
            </Typography>
            <TextField
              label="用户名"
              variant="outlined"
              fullWidth
              color="secondary"
              onValueChange={(v) => setName(v)}
              required
              validator={{
                rules: {
                  valueMissing: "请输入用户名",
                },
              }}
            />
            <PasswordField
              label="密码"
              fullWidth
              color="secondary"
              onValueChange={(v) => setPassword(v)}
              required
              validator={{
                rules: {
                  valueMissing: "请输入密码",
                },
              }}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={!name || !password}
            >
              登录
            </Button>
          </CardContent>
        </Box>
      </Card>
    </div>
  );
};

export default Login;
