"use client";

import { PatientViewCard } from "@/app/_components/patient/PatientViewCard";
import { RadiologyTable } from "@/app/_components/radiology/RadiologyTable";
import { GradientCircularProgress } from "@/components/animation/Loading";
import { useRadiologyStore } from "@/lib/stores/radiology";
import { Radiology } from "@/lib/types/radiology";
import { Button, IconButton, Tooltip } from "@mui/material";
import { NotebookPen, Plus, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ViewPage = () => {
  const router = useRouter();
  const { patient } = useRadiologyStore();

  if (!patient) {
    return <GradientCircularProgress />;
  }

  const handleBack = () => {
    useRadiologyStore.getState().clearViewedPatient();
    router.push("/radiology");
  };

  const handleAdd = () => {
    useRadiologyStore.getState().resetRadiology(patient.id);
    router.push("/radiology/edit");
  };

  const handleEdit = (radiology: Radiology) => {
    useRadiologyStore.getState().setRadiology(radiology);
    router.push("/radiology/edit");
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

      <RadiologyTable
        id={patient.id}
        operator={(radiology: Radiology) => (
          <Tooltip title="修改医学图像">
            <IconButton color="warning" onClick={() => handleEdit(radiology)}>
              <NotebookPen className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        )}
      />
    </div>
  );
};

export default ViewPage;
