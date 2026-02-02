"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { ColumnDef, Table } from "@/components/data";
import { deleteUser, getUsers } from "@/lib/apis/user";
import { PaginationData } from "@/lib/types/pagination";
import { User } from "@/lib/types/user";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Plus, Trash2, UserPen } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { EditDialog } from "./_components/EditDialog";

const UserPage = () => {
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<PaginationData<User>>({
    items: [],
    total: 0,
    page,
    limit: 10,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const users = await getUsers(page);
      setRows(users);
    });
  }, [page]);

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id!);
      toast.success("删除成功!");
      startTransition(async () => {
        const users = await getUsers(page);
        setRows(users);
      });
    } catch (err) {
      toast.error(err as string);
    }
  };

  const onDialogConfirmed = () => {
    startTransition(async () => {
      const users = await getUsers(page);
      setRows(users);
    });
  };

  const columns: readonly ColumnDef<User>[] = [
    {
      field: "name",
      headerName: "名称",
      render: (row: User) => {
        return row.name;
      },
    },
    {
      field: "operator",
      headerName: "操作",
      render: (user: User) => {
        return (
          <>
            <EditDialog
              trigger={
                <Tooltip title="编辑">
                  <IconButton color="warning">
                    <UserPen className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
              }
              user={user}
              onConfirmed={onDialogConfirmed}
            />
            {user.name !== "admin" && (
              <Tooltip title="删除">
                <IconButton color="error" onClick={() => handleDelete(user)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col items-start gap-4">
      {isPending ? (
        <GradientCircularProgress />
      ) : (
        <>
          <EditDialog
            trigger={
              <Button
                variant="outlined"
                className="gap-2"
                color="info"
                startIcon={<Plus className="h-4 w-4" />}
              >
                新增
              </Button>
            }
            onConfirmed={onDialogConfirmed}
          />
          <Table
            columns={columns as ColumnDef<unknown>[]}
            rows={rows}
            onPageSwitch={setPage}
          />
        </>
      )}
    </div>
  );
};

export default UserPage;
