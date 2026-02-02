"use client";

import { PatientViewCard } from "@/app/_components/patient/PatientViewCard";
import { QuestionnaireTable } from "@/app/_components/questionnaire/QuestionnaireTable";
import { GradientCircularProgress } from "@/components/animation/Loading";
import { useNavbarStore } from "@/components/sidebar/store";
import { getQuestionnaire } from "@/lib/apis/questionnaire";
import { useQuestionnaireStore } from "@/lib/stores/questionnaire";
import { Questionnaire } from "@/lib/types/questionnaire";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ViewPage = () => {
  const router = useRouter();
  const { patient } = useQuestionnaireStore();

  if (!patient) {
    return <GradientCircularProgress />;
  }

  const handleAdd = () => {
    useNavbarStore
      .getState()
      .addRouter({ title: "新增问卷", href: "/questionnaire/add" });

    useQuestionnaireStore.getState().clearAnswers();
    useQuestionnaireStore.getState().setViewedPatient(patient);
    router.push("/questionnaire/add");
  };

  const handleViewDetail = async (id: number) => {
    useNavbarStore
      .getState()
      .addRouter({ title: "问卷详情", href: "/questionnaire/add" });

    try {
      const answers = await getQuestionnaire(id);
      if (answers.length === 0) {
        toast.error("问卷内容为空");
        return;
      }

      useQuestionnaireStore.getState().setViewMode(answers);
      router.push("/questionnaire/add");
    } catch (err) {
      toast.error(err as string);
    }
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

      <QuestionnaireTable
        id={patient.id}
        operator={(questionnaire: Questionnaire) => (
          <Tooltip title="查看问卷">
            <IconButton
              color="info"
              onClick={() => handleViewDetail(questionnaire.id)}
            >
              <Eye className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        )}
      />
    </div>
  );
};

export default ViewPage;
