"use client";

import { PatientTable } from "@/app/_components/patient/PatientTable";
import { usePatientStore } from "@/lib/stores/patient";
import { Patient } from "@/lib/types/patient";
import { IconButton, Tooltip } from "@mui/material";
import { UserRoundPen } from "lucide-react";
import { useRouter } from "next/navigation";

const PatientsPage = () => {
  const { setPatient } = usePatientStore();
  const router = useRouter();

  const handleEdit = (patient: Patient) => {
    setPatient(patient);
    router.push("/patients/edit");
  };

  return (
    <PatientTable
      operator={(patient: Patient) => (
        <Tooltip title="编辑">
          <IconButton color="warning" onClick={() => handleEdit(patient)}>
            <UserRoundPen className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      )}
    />
  );
};

export default PatientsPage;
