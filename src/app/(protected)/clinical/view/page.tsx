"use client";

import { ClinicalTable } from "@/app/_components/clinical/ClinicalTable";
import { PatientViewCard } from "@/app/_components/patient/PatientViewCard";
import { GradientCircularProgress } from "@/components/animation/Loading";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Clinical } from "@/lib/types/clinical";
import { Button, IconButton, Tooltip } from "@mui/material";
import { NotebookPen, Plus, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ViewPage = () => {
  const router = useRouter();
  const { patient } = useClinicalStore();

  if (!patient) {
    return <GradientCircularProgress />;
  }

  const handleBack = () => {
    useClinicalStore.getState().clearViewedPatient();
    router.push("/clinical");
  };

  const handleAdd = () => {
    useClinicalStore.getState().resetClinical(patient.id);
    router.push("/clinical/edit");
  };

  const handleEdit = (clinical: Clinical) => {
    useClinicalStore.getState().setClinical(clinical);
    router.push("/clinical/edit");
  };

  return (
    <div className="flex flex-col gap-4">
      <PatientViewCard
        patient={patient}
        actions={
          <div className="flex gap-4">
            <Button
              variant="text"
              className="bg-primary-50 hover:bg-primary-200 gap-2"
              startIcon={<Undo2 className="h-4 w-4" />}
              onClick={handleBack}
            >
              返回
            </Button>
            <Button
              variant="outlined"
              className="gap-2"
              color="info"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={handleAdd}
            >
              新增
            </Button>
          </div>
        }
      />

      <ClinicalTable
        id={patient.id}
        operator={(clinical: Clinical) => (
          <Tooltip title="修改临床信息">
            <IconButton color="warning" onClick={() => handleEdit(clinical)}>
              <NotebookPen className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        )}
      />
    </div>
  );
};

export default ViewPage;
