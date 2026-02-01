"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { ColumnDef, Table } from "@/components/data";
import { getQuestionnaireList } from "@/lib/apis/questionnaire";
import { formatDate } from "@/lib/date";
import { PaginationData } from "@/lib/types/pagination";
import { Questionnaire } from "@/lib/types/questionnaire";
import { useEffect, useState } from "react";

export const QuestionnaireTable = ({
  id,
  operator,
}: {
  id: number;
  operator: (questionnaire: Questionnaire) => React.ReactNode;
}) => {
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<PaginationData<Questionnaire>>({
    items: [],
    total: 0,
    page,
    limit: 10,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const retriever = async () => {
      setLoading(true);
      const response = await getQuestionnaireList(id, page);
      setRows(response);
      setLoading(false);
    };

    retriever();
  }, [id, page]);

  const columns: readonly ColumnDef<Questionnaire>[] = [
    {
      field: "score",
      headerName: "得分",
      render: (row: Questionnaire) => {
        return row.score;
      },
    },
    {
      field: "created_at",
      headerName: "填写时间",
      render: (row: Questionnaire) => {
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
