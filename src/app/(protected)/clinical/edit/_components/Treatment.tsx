import { FormGrid } from "@/components/data/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";
import { TreatmentOptions } from "@/lib/types/clinical";
import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useState } from "react";

export const Treatment = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const [type, setType] = useState(
    TreatmentOptions.includes(clinical.treatment) ? clinical.treatment : "其他",
  );
  const [other, setOther] = useState(
    TreatmentOptions.includes(clinical.treatment) ? "" : clinical.treatment,
  );

  return (
    <FormGrid id="treatment" label="既往接受的治疗方式">
      <div className="flex flex-col flex-wrap">
        <RadioGroup
          row
          aria-labelledby="treatment-label"
          name="treatment"
          value={type}
          onChange={(e) => {
            const value = e.target.value;
            setType(value);
            if (value !== "其他") {
              setOther("");
              updateClinical({ treatment: value });
            } else {
              // Will be updated in the other text field.
            }
          }}
        >
          {TreatmentOptions.map((item) => (
            <FormControlLabel
              key={item}
              value={item}
              control={<Radio color="info" />}
              label={<Typography variant="body1">{item}</Typography>}
            />
          ))}
        </RadioGroup>
        {type === "其他" && (
          <TextField
            label="请填写治疗方式"
            value={other}
            onValueChange={(v) => {
              setOther(v);
              updateClinical({ treatment: v });
            }}
          />
        )}
      </div>
    </FormGrid>
  );
};
