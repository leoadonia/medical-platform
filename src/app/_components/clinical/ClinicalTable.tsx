"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { ColumnDef, Table } from "@/components/data";
import { getClinicalList } from "@/lib/apis/clinical";
import { formatAgeFromBirthday, formatDate } from "@/lib/date";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Clinical } from "@/lib/types/clinical";
import { PaginationData } from "@/lib/types/pagination";
import { useEffect, useState } from "react";

export const ClinicalTable = ({
  id,
  operator,
}: {
  id: number;
  operator: (clinical: Clinical) => React.ReactNode;
}) => {
  const { patient } = useClinicalStore();
  const age = formatAgeFromBirthday(patient!.birthday);

  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<PaginationData<Clinical>>({
    items: [],
    total: 0,
    page,
    limit: 10,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const retriever = async () => {
      setLoading(true);
      const response = await getClinicalList(id, page);
      setRows(response);
      setLoading(false);
    };

    retriever();
  }, [id, page]);

  const columns: readonly ColumnDef<Clinical>[] = [
    {
      field: "cobb",
      headerName: "Cobb角",
      render: (row: Clinical) => {
        return row.cobb.cobb;
      },
    },
    {
      field: "risser",
      headerName: "Risser等级",
      render: (row: Clinical) => {
        return row.risser;
      },
    },
    {
      field: "exacerbate",
      headerName: "恶化因子",
      render: (row: Clinical) => {
        if (age > 0 && row.cobb.cobb > 0) {
          return (row.cobb.cobb - 3 * row.risser) / age;
        }

        return "";
      },
    },
    {
      field: "created_at",
      headerName: "就诊时间",
      render: (row: Clinical) => {
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
