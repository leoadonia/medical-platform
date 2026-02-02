"use client";

import { ClinicalTable } from "@/app/_components/clinical/ClinicalTable";
import { PatientViewCard } from "@/app/_components/patient/PatientViewCard";
import { GradientCircularProgress } from "@/components/animation/Loading";
import { useNavbarStore } from "@/components/sidebar/store";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Clinical } from "@/lib/types/clinical";
import { Button, IconButton, Tooltip } from "@mui/material";
import { NotebookPen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ViewPage = () => {
  const router = useRouter();
  const { patient } = useClinicalStore();

  if (!patient) {
    return <GradientCircularProgress />;
  }

  const handleAdd = () => {
    useNavbarStore
      .getState()
      .addRouter({ title: "添加临床信息", href: "/clinical/edit" });

    useClinicalStore.getState().resetClinical(patient.id);
    router.push("/clinical/edit");
  };

  const handleEdit = (clinical: Clinical) => {
    useNavbarStore
      .getState()
      .addRouter({ title: "修改临床信息", href: "/clinical/edit" });

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
