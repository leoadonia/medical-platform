import { FormGrid } from "@/app/_components/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";
import { SkinComplicationOptions } from "@/lib/types/clinical";
import {
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { ClinicalCard } from "./ClinicalCard";

const SkinComplications = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { brace = { type: "", daily_duration: 0, skin_complications: "" } } =
    clinical;

  const [hasSkinComplication, setHasSkinComplication] = useState(
    brace.skin_complications !== "" ? "Y" : "N",
  );

  const handleComplicationSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHasSkinComplication(value);
    if (value === "N") {
      updateClinical({
        brace: { ...brace, skin_complications: "" },
      });
    }
  };

  return (
    <>
      <FormLabel id="skin-complication-label">
        <Typography variant="subtitle1">是否有皮肤并发症:</Typography>
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="skin-complication-label"
        name="has-skin-complication"
        value={hasSkinComplication}
        onChange={handleComplicationSwitch}
      >
        <FormControlLabel
          value="Y"
          control={<Radio color="secondary" />}
          label="是"
        />
        <FormControlLabel
          value="N"
          control={<Radio color="secondary" />}
          label="否"
        />
      </RadioGroup>
      {hasSkinComplication === "Y" && (
        <Select
          value={brace.skin_complications}
          onChange={(e) =>
            updateClinical({
              brace: { ...brace, skin_complications: e.target.value },
            })
          }
          className="min-w-24 rounded-lg"
        >
          {SkinComplicationOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
};

const BraceDetail = () => {
  const { clinical, updateClinical } = useClinicalStore();
  const { brace = { type: "", daily_duration: 0, skin_complications: "" } } =
    clinical;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4">
        <TextField
          label="支具类型"
          value={brace.type}
          onValueChange={(v) =>
            updateClinical({ brace: { ...brace, type: v } })
          }
        />
        <TextField
          label="每日佩戴时长(小时)"
          type="number"
          value={brace.daily_duration}
          onValueChange={(v) =>
            updateClinical({
              brace: { ...brace, daily_duration: Number(v) },
            })
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SkinComplications />
      </div>
    </div>
  );
};

export const Brace = () => {
  const { clinical, updateClinical } = useClinicalStore();

  const [whetherWearing, setWhetherWearing] = useState(
    clinical.brace ? "Y" : "N",
  );

  const handleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWhetherWearing(value);

    if (value === "N") {
      updateClinical({ brace: undefined });
    }
  };

  return (
    <ClinicalCard>
      <FormGrid id="brace" label="是否穿戴支具">
        <div className="flex flex-col">
          <RadioGroup
            row
            aria-labelledby="wearing-brace-label"
            name="is-wearing-brace"
            value={whetherWearing}
            onChange={handleSwitch}
          >
            <FormControlLabel
              value="Y"
              control={<Radio color="info" />}
              label="是"
            />
            <FormControlLabel
              value="N"
              control={<Radio color="info" />}
              label="否"
            />
          </RadioGroup>
          {whetherWearing === "Y" && <BraceDetail />}
        </div>
      </FormGrid>
    </ClinicalCard>
  );
};
