"use client";

import { PatientTable } from "@/app/_components/patient/PatientTable";
import { useQuestionnaireStore } from "@/lib/stores/questionnaire";
import { Patient } from "@/lib/types/patient";
import { IconButton, Tooltip } from "@mui/material";
import { MessageCirclePlus, MessageCircleQuestionMark } from "lucide-react";
import { useRouter } from "next/navigation";

const QuestionnairePage = () => {
  const router = useRouter();

  const handleAdd = (patient: Patient) => {
    useQuestionnaireStore.getState().clearAnswers();
    useQuestionnaireStore.getState().setViewedPatient(patient);
    router.push("/questionnaire/add");
  };

  const handleView = (patient: Patient) => {
    useQuestionnaireStore.getState().setViewedPatient(patient);
    router.push("/questionnaire/view");
  };

  return (
    <PatientTable
      operator={(patient: Patient) => (
        <>
          <Tooltip title="添加问卷">
            <IconButton color="info" onClick={() => handleAdd(patient)}>
              <MessageCirclePlus className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="查看问卷列表">
            <IconButton color="secondary" onClick={() => handleView(patient)}>
              <MessageCircleQuestionMark className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </>
      )}
    />
  );
};

export default QuestionnairePage;
