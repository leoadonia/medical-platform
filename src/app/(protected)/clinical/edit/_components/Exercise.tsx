"use client";

import { FormGrid } from "@/app/_components/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";
import { ExerciseOptions } from "@/lib/types/clinical";
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

const FrequencyOptions = {
  1: "每周一次",
  2: "每周两次",
  3: "每周三次",
  4: "每周四次",
  5: "每周五次",
  6: "超过五次",
};

const ExerciseFrequency = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { exercise = { type: "", frequency: 1 } } = clinical;
  const [option, setOption] = useState(exercise.frequency);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setOption(Number(value));
    updateClinical({ exercise: { ...exercise, frequency: Number(value) } });
  };

  return (
    <FormGrid id="exercise_frequency" label="锻炼频率">
      <Select
        value={option.toString()}
        onChange={handleChange}
        aria-labelledby="exercise-frequency-label"
        color="secondary"
        className="rounded-lg"
      >
        {Object.entries(FrequencyOptions).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormGrid>
  );
};

export const Exercise = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { exercise = { type: "", frequency: 1 } } = clinical;

  const [type, setType] = useState(
    exercise.type === "" || ExerciseOptions.includes(exercise.type)
      ? exercise.type
      : "其他",
  );
  const [other, setOther] = useState(
    ExerciseOptions.includes(exercise.type) ? "" : exercise.type,
  );

  const handleTypeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setType(value);

    if (value === "") {
      updateClinical({ exercise: undefined });
    } else {
      if (value !== "其他") {
        setOther("");
        updateClinical({ exercise: { ...exercise, type: value } });
      } else {
        // If other, pass through the exercise info after manual input changed.
      }
    }
  };

  return (
    <FormGrid id="exercise" label="锻炼方式">
      <div className="flex flex-col flex-wrap">
        <RadioGroup
          row
          aria-labelledby="exercise-label"
          name="type"
          value={type}
          onChange={handleTypeSwitch}
        >
          <FormControlLabel
            value={""}
            control={<Radio color="info" />}
            label={
              <Typography color="error" variant="body1">
                不锻炼
              </Typography>
            }
          />
          {ExerciseOptions.map((item) => (
            <FormControlLabel
              key={item}
              value={item}
              control={<Radio color="secondary" />}
              label={<Typography variant="body1">{item}</Typography>}
            />
          ))}
        </RadioGroup>
        {type === "其他" && (
          <TextField
            label="请填写锻炼方式"
            value={other}
            onValueChange={(v) => {
              setOther(v);
              updateClinical({ exercise: { ...exercise, type: v } });
            }}
          />
        )}
        <div className="mt-2">
          <ExerciseFrequency />
        </div>
      </div>
    </FormGrid>
  );
};
