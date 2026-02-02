"use client";

import { PatientViewCard } from "@/app/_components/patient/PatientViewCard";
import Question from "@/app/_components/questionnaire/Question";
import { GradientCircularProgress } from "@/components/animation/Loading";
import { useNavbarStore } from "@/components/sidebar/store";
import { addQuestionnaire } from "@/lib/apis/questionnaire";
import { useQuestionnaireStore } from "@/lib/stores/questionnaire";
import { QuestionOptions } from "@/lib/types/questionnaire";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const PageNumInfo = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <div className="typography-subtitle1 flex items-center gap-2">
        第<span className="font-bold text-pink-600">{current}</span>题 / 共
        <span className="text-pink-500">{total}</span>题
      </div>
    </Box>
  );
};

const QuestionnaireAddPage = () => {
  const router = useRouter();

  const { answers, patient, viewMode } = useQuestionnaireStore();
  const [index, setIndex] = useState(0);
  const total = QuestionOptions.length;

  if (!patient) {
    return <GradientCircularProgress />;
  }

  const handleSubmit = async () => {
    try {
      await addQuestionnaire(patient.id, answers);
      toast.success("问卷添加成功");

      const href = useNavbarStore.getState().back() || "/questionnaire";
      router.push(href);
    } catch (err) {
      toast.error(err as string);
    }
  };

  const handleNavigation = (diff: number) => {
    setIndex((prev) => prev + diff);
  };

  const Previous = () => (
    <Tooltip title="上一题">
      <IconButton
        onClick={() => handleNavigation(-1)}
        disabled={index === 0}
        className="bg-info-50"
      >
        <ArrowBigLeft className="text-info-300 h-8 w-8" />
      </IconButton>
    </Tooltip>
  );

  const Next = () => (
    <Tooltip title="下一题">
      <IconButton
        onClick={() => handleNavigation(1)}
        disabled={index === total - 1 || !answers[index]}
        className="bg-info-50"
      >
        <ArrowBigRight className="text-info-300 h-8 w-8" />
      </IconButton>
    </Tooltip>
  );

  return (
    <div className="flex flex-col gap-4">
      <PatientViewCard patient={patient} />
      <Card className="rounded-2xl border border-pink-300 bg-white/60 shadow-lg shadow-pink-200">
        <CardHeader
          className="px-8"
          title="问卷内容"
          action={
            viewMode ? null : (
              <Button
                size="small"
                onClick={handleSubmit}
                disabled={index !== total - 1 || !answers[index]}
              >
                提交
              </Button>
            )
          }
        />
        <CardContent>
          <div className="flex flex-col gap-4">
            <PageNumInfo current={index + 1} total={total} />

            <div className="flex items-center">
              <div className="flex w-[20%] justify-center">{Previous()}</div>
              <div className="w-[60%]">
                <Question key={index} questionIdx={index} />
              </div>
              <div className="flex w-[20%] justify-center">{Next()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnaireAddPage;
