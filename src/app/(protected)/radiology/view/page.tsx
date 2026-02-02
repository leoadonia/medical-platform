"use client";

import { PatientViewCard } from "@/app/_components/patient/PatientViewCard";
import { RadiologyTable } from "@/app/_components/radiology/RadiologyTable";
import { GradientCircularProgress } from "@/components/animation/Loading";
import { useNavbarStore } from "@/components/sidebar/store";
import { useRadiologyStore } from "@/lib/stores/radiology";
import { Radiology } from "@/lib/types/radiology";
import { Button, IconButton, Tooltip } from "@mui/material";
import { NotebookPen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ViewPage = () => {
  const router = useRouter();
  const { patient } = useRadiologyStore();

  if (!patient) {
    return <GradientCircularProgress />;
  }

  const handleAdd = () => {
    useNavbarStore
      .getState()
      .addRouter({ title: "新增影像", href: "/radiology/edit" });

    useRadiologyStore.getState().resetRadiology(patient.id);
    router.push("/radiology/edit");
  };

  const handleEdit = (radiology: Radiology) => {
    useNavbarStore
      .getState()
      .addRouter({ title: "修改影像", href: "/radiology/edit" });

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
