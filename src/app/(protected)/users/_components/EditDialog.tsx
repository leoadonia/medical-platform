"use client";

import { PasswordField } from "@/components/input/PasswordField";
import { TextField } from "@/components/input/TextField";
import { addUser, modifyPassword } from "@/lib/apis/user";
import { User } from "@/lib/types/user";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export type ClickableElement<P = unknown> = React.ReactElement<
  P & { onClick?: React.MouseEventHandler }
>;

export const EditDialog = ({
  trigger,
  user,
  onConfirmed,
}: {
  trigger: ClickableElement;
  user?: User;
  onConfirmed?: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState("");

  const btn = React.cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      const { onClick } = trigger.props;
      setOpen(true);
      onClick?.(e);
    },
  });

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (user) {
        await modifyPassword(user.id!, password);
      } else {
        await addUser({
          name,
          password,
        });
      }

      toast.success("操作成功");
      setOpen(false);
      onConfirmed?.();
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <React.Fragment>
      {btn}
      <Dialog
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          p={2}
          alignItems={"center"}
        >
          <Typography variant="subtitle1" color="textSecondary" pl={2}>
            {user ? "修改密码" : "添加用户"}
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} color="warning">
            <Tooltip title={"关闭"}>
              <X className="h-4 w-4" />
            </Tooltip>
          </IconButton>
        </Box>

        <DialogContent className="px-8">
          <div className="flex flex-col items-center">
            <TextField
              label="用户名"
              value={name}
              readonly={user !== undefined}
              className="min-w-xs"
              onValueChange={(v) => setName(v)}
            />
            <PasswordField
              label="密码"
              className="min-w-xs"
              onValueChange={(v) => setPassword(v)}
              required
              validator={{
                rules: {
                  valueMissing: "请输入密码",
                },
              }}
            />
            <PasswordField
              label="确认密码"
              className="min-w-xs"
              onValueChange={(v) => setConfirmed(v)}
              required
              validator={{
                rules: {
                  valueMissing: "请再次输入密码",
                },
              }}
            />
          </div>
          {password !== confirmed && (
            <Typography
              variant="caption"
              className="mt-2 items-start text-pink-600"
            >
              两次输入的密码不一致.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            className="bg-gray-900"
            onClick={handleSubmit}
            disabled={!password || password != confirmed}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
