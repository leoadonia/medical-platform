import { FormGrid } from "@/app/_components/FormGrid";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Slider } from "@mui/material";

export const PainRate = () => {
  const { clinical, updateClinical } = useClinicalStore();

  return (
    <FormGrid id="pain_rate" label="疼痛评分 (VAS评分)">
      <Slider
        color="info"
        value={clinical.pain_rate}
        onChange={(_, v) => updateClinical({ pain_rate: v })}
        marks
        min={1}
        max={10}
        step={1}
        valueLabelDisplay="on"
        className="mt-6 max-w-md"
      />
    </FormGrid>
  );
};
