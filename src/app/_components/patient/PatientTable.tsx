"use client";

import { GradientCircularProgress } from "@/components/animation/Loading";
import { ColumnDef, Table } from "@/components/data";
import { getPatients } from "@/lib/apis/patient";
import { formatAgeFromBirthday } from "@/lib/date";
import { PaginationData } from "@/lib/types/pagination";
import { Patient, SearchParams } from "@/lib/types/patient";
import { useCallback, useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export const PatientTable = (props: {
  operator?: (patient: Patient) => React.ReactNode;
}) => {
  const [page, setPage] = useState<number>(1);
  const [patients, setPatients] = useState<PaginationData<Patient>>({
    total: 0,
    items: [],
    page,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [params, setParams] = useState<SearchParams>({});

  const handleSearch = useCallback((p: SearchParams) => {
    setParams({ ...p });
  }, []);

  useEffect(() => {
    const retriever = async () => {
      setLoading(true);
      const response = await getPatients(params, page);
      setPatients(response);
      setLoading(false);
    };

    retriever();
  }, [params, page]);

  const columns: ColumnDef<Patient>[] = [
    {
      field: "registration_number",
      headerName: "登记号",
    },
    {
      field: "name",
      headerName: "姓名",
    },
    {
      field: "age",
      headerName: "年龄",
      render: (row: Patient) => {
        return formatAgeFromBirthday(row.birthday);
      },
    },
    {
      field: "gender",
      headerName: "性别",
    },
    {
      field: "contact",
      headerName: "联系方式",
    },
    {
      field: "created_at",
      headerName: "登记时间",
      render: (row: unknown) => {
        const patient = row as Patient;
        return new Date(patient.created_at * 1000).toLocaleDateString();
      },
    },
  ];
  if (props.operator) {
    columns.push({
      field: "operator",
      headerName: "操作",
      render: (row: Patient) => {
        return props.operator!(row);
      },
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <GradientCircularProgress />
      ) : (
        <Table
          columns={columns as ColumnDef<unknown>[]}
          rows={patients}
          onPageSwitch={setPage}
        />
      )}
    </div>
  );
};
