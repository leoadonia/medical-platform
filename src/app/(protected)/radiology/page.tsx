"use client";

import { PatientTable } from "@/app/_components/patient/PatientTable";
import { useRadiologyStore } from "@/lib/stores/radiology";
import { Patient } from "@/lib/types/patient";
import { IconButton, Tooltip } from "@mui/material";
import { BatteryPlus, Radiation } from "lucide-react";
import { useRouter } from "next/navigation";

const RadiologyPage = () => {
  const router = useRouter();

  const handleAdd = (patient: Patient) => {
    useRadiologyStore.getState().resetRadiology(patient.id);
    router.push("radiology/edit");
  };

  const handleView = (patient: Patient) => {
    useRadiologyStore.getState().setViewedPatient(patient);
    router.push("/radiology/view");
  };

  return (
    <PatientTable
      operator={(patient: Patient) => (
        <>
          <Tooltip title="添加医学影象">
            <IconButton color="info" onClick={() => handleAdd(patient)}>
              <BatteryPlus className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="查看医学影象列表">
            <IconButton color="secondary" onClick={() => handleView(patient)}>
              <Radiation className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </>
      )}
    />
  );
};

export default RadiologyPage;
