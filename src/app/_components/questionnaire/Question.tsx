"use client";

import { useQuestionnaireStore } from "@/lib/stores/questionnaire";
import { QuestionOptions } from "@/lib/types/questionnaire";
import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useState } from "react";

const Question = ({ questionIdx }: { questionIdx: number }) => {
  const { title, options, order = "ascending" } = QuestionOptions[questionIdx];
  const { answers, setAnswer } = useQuestionnaireStore();
  const answer = answers[questionIdx] || { index: 0, score: 0 };

  const [value, setValue] = useState<number>(answer.score);

  const calcValue = (index: number): number => {
    if (order === "ascending") {
      return index + 1;
    }
    return options.length - index;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    setValue(Number(value));

    setAnswer(questionIdx, { index, score: Number(value) });

    console.log(">>>>", answers);
  };

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="subtitle1" color="info">
        {title}
      </Typography>
      <RadioGroup value={value}>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={calcValue(index)}
            control={
              <Radio color="info" onChange={(e) => handleChange(e, index)} />
            }
            label={<Typography variant="body1">{option}</Typography>}
            className="hover:bg-info-50 hover:rounded-xl"
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default Question;
