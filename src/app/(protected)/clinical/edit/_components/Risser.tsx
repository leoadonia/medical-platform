import { FormGrid } from "@/components/data/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Slider } from "@mui/material";
import { ClinicalCard } from "./ClinicalCard";

export const Risser = () => {
  const { clinical, updateClinical } = useClinicalStore();

  return (
    <ClinicalCard>
      <FormGrid id="extremity" label="双下肢长度">
        <div className="flex gap-4">
          <TextField
            label="左下肢"
            value={clinical.extremity.left}
            type="number"
            endIcon={"cm"}
            onValueChange={(v) =>
              updateClinical({
                extremity: { ...clinical.extremity, left: Number(v) },
              })
            }
          />
          <TextField
            label="右下肢"
            value={clinical.extremity.right}
            type="number"
            endIcon={"cm"}
            onValueChange={(v) =>
              updateClinical({
                extremity: { ...clinical.extremity, right: Number(v) },
              })
            }
          />
        </div>
      </FormGrid>
      <FormGrid id="risser" label="Risser等级">
        <Slider
          color="info"
          value={clinical.risser}
          onChange={(_, v) => updateClinical({ risser: v })}
          marks
          min={0}
          max={5}
          step={1}
          valueLabelDisplay="on"
          className="mt-6 max-w-md"
        />
      </FormGrid>
    </ClinicalCard>
  );
};
