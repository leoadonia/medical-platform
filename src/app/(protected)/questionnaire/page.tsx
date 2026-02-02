"use client";

import { PatientTable } from "@/app/_components/patient/PatientTable";
import { useNavbarStore } from "@/components/sidebar/store";
import { useQuestionnaireStore } from "@/lib/stores/questionnaire";
import { Patient } from "@/lib/types/patient";
import { IconButton, Tooltip } from "@mui/material";
import { MessageCirclePlus, MessageCircleQuestionMark } from "lucide-react";
import { useRouter } from "next/navigation";

const QuestionnairePage = () => {
  const router = useRouter();

  const handleAdd = (patient: Patient) => {
    useNavbarStore
      .getState()
      .addRouter({ title: "添加问卷", href: "/questionnaire/add" });

    useQuestionnaireStore.getState().clearAnswers();
    useQuestionnaireStore.getState().setViewedPatient(patient);
    router.push("/questionnaire/add");
  };

  const handleView = (patient: Patient) => {
    useNavbarStore
      .getState()
      .addRouter({ title: "查看列表", href: "/questionnaire/view" });

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
