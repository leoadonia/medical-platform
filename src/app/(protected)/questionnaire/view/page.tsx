"use client";

import { PatientViewCard } from "@/app/_components/patient/PatientViewCard";
import { QuestionnaireTable } from "@/app/_components/questionnaire/QuestionnaireTable";
import { GradientCircularProgress } from "@/components/animation/Loading";
import { getQuestionnaire } from "@/lib/apis/questionnaire";
import { useQuestionnaireStore } from "@/lib/stores/questionnaire";
import { Questionnaire } from "@/lib/types/questionnaire";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Eye, Plus, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ViewPage = () => {
  const router = useRouter();
  const { patient } = useQuestionnaireStore();

  if (!patient) {
    return <GradientCircularProgress />;
  }

  const handleBack = () => {
    useQuestionnaireStore.getState().clearViewedPatient();
    router.push("/questionnaire");
  };

  const handleAdd = () => {
    useQuestionnaireStore.getState().clearAnswers();
    useQuestionnaireStore.getState().setViewedPatient(patient);
    router.push("/questionnaire/add");
  };

  const handleViewDetail = async (id: number) => {
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
