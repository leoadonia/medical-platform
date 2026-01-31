"use client";

import { FormGrid } from "@/app/_components/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";

export const Tenderness = () => {
  const { clinical, updateClinical } = useClinicalStore();

  const [tenderOption, setTenderOption] = useState(
    clinical.tenderness === "" ? "N" : "Y",
  );
  const [percussionOption, setPercussionOption] = useState(
    clinical.percussion === "" ? "N" : "Y",
  );

  const handleTenderSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTenderOption(value);
    if (value === "N") {
      updateClinical({ ...clinical, tenderness: "" });
    }
  };

  const handlePercussionSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPercussionOption(value);
    if (value === "N") {
      updateClinical({ ...clinical, percussion: "" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormGrid id="tenderness" label="脊柱棘突上/棘突旁有无压痛">
        <Box display={"flex"} gap={4}>
          <RadioGroup
            row
            aria-labelledby="tenderness-label"
            name="tenderness"
            value={tenderOption}
            onChange={handleTenderSwitch}
          >
            <FormControlLabel
              value={"Y"}
              control={<Radio color="info" />}
              label={"是"}
            />
            <FormControlLabel
              value={"N"}
              control={<Radio color="info" />}
              label={"否"}
            />
          </RadioGroup>
          {tenderOption === "Y" && (
            <TextField
              label="请填写具体位置"
              value={clinical.tenderness}
              onValueChange={(v) => {
                updateClinical({ ...clinical, tenderness: v });
              }}
            />
          )}
        </Box>
      </FormGrid>
      <FormGrid id="percussion" label="脊柱棘突上/棘突旁有无叩痛">
        <Box display={"flex"} gap={4}>
          <RadioGroup
            row
            aria-labelledby="percussion-label"
            name="percussion"
            value={percussionOption}
            onChange={handlePercussionSwitch}
          >
            <FormControlLabel
              value={"Y"}
              control={<Radio color="info" />}
              label={"是"}
            />
            <FormControlLabel
              value={"N"}
              control={<Radio color="info" />}
              label={"否"}
            />
          </RadioGroup>
          {percussionOption === "Y" && (
            <TextField
              label="请填写具体位置"
              value={clinical.percussion}
              onValueChange={(v) => {
                updateClinical({ ...clinical, percussion: v });
              }}
            />
          )}
        </Box>
      </FormGrid>
    </div>
  );
};
