"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { ColumnDef, Table } from "@/components/data";
import { ImageViewer } from "@/components/input/ImageViewer";
import { selectRadiology } from "@/lib/apis/radiology";
import { formatDate } from "@/lib/date";
import { PaginationData } from "@/lib/types/pagination";
import { Radiology } from "@/lib/types/radiology";
import { useEffect, useState } from "react";

export const RadiologyTable = ({
  id,
  operator,
}: {
  id: number;
  operator: (radiology: Radiology) => React.ReactNode;
}) => {
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<PaginationData<Radiology>>({
    items: [],
    total: 0,
    page,
    limit: 10,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const retriever = async () => {
      setLoading(true);
      const response = await selectRadiology(id, page);
      setRows(response);
      setLoading(false);
    };

    retriever();
  }, [id, page]);

  const columns: readonly ColumnDef<Radiology>[] = [
    {
      field: "x_ray",
      headerName: "X光",
      render: (row: Radiology) => {
        return <ImageViewer src={row.x_ray} />;
      },
    },
    {
      field: "posture_frontend",
      headerName: "体态(前)",
      render: (row: Radiology) => {
        return <ImageViewer src={row.posture_frontend} />;
      },
    },
    {
      field: "posture_backend",
      headerName: "体态(后)",
      render: (row: Radiology) => {
        return <ImageViewer src={row.posture_backend} />;
      },
    },
    {
      field: "posture_left",
      headerName: "体态(左)",
      render: (row: Radiology) => {
        return <ImageViewer src={row.posture_left} />;
      },
    },
    {
      field: "posture_right",
      headerName: "体态(右)",
      render: (row: Radiology) => {
        return <ImageViewer src={row.posture_right} />;
      },
    },
    {
      field: "created_at",
      headerName: "就诊时间",
      render: (row: Radiology) => {
        return formatDate(row.created_at);
      },
    },
    {
      field: "operator",
      headerName: "操作",
      render: operator,
    },
  ];

  return (
    <div className="flex items-center">
      {loading ? (
        <GradientCircularProgress />
      ) : (
        <Table
          columns={columns as ColumnDef<unknown>[]}
          rows={rows}
          onPageSwitch={setPage}
        />
      )}
    </div>
  );
};
