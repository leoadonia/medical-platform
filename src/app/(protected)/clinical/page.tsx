"use client";

import { PatientTable } from "@/app/_components/patient/PatientTable";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Patient } from "@/lib/types/patient";
import { IconButton, Tooltip } from "@mui/material";
import { NotebookTabs, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const ClinicalPage = () => {
  const router = useRouter();

  const handleAdd = (pid: number) => {
    useClinicalStore.getState().resetClinical(pid);
    router.push("/clinical/edit");
  };

  const handleView = (patient: Patient) => {
    useClinicalStore.getState().setViewedPatient(patient);
    router.push("/clinical/view");
  };

  return (
    <PatientTable
      operator={(patient: Patient) => (
        <>
          <Tooltip title="添加临床信息">
            <IconButton color="info" onClick={() => handleAdd(patient.id)}>
              <UserRoundPlus className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="查看临床信息列表">
            <IconButton color="secondary" onClick={() => handleView(patient)}>
              <NotebookTabs className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </>
      )}
    />
  );
};

export default ClinicalPage;
