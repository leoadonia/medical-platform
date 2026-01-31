import { FormGrid } from "@/app/_components/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";

export const FlexionAtr = () => {
  const { clinical, updateClinical } = useClinicalStore();

  return (
    <FormGrid id="flexion_atr" label="前屈试验 (ATR角)">
      <div className="flex flex-wrap gap-4">
        <TextField
          label="部位"
          value={clinical.flexion_atr.position}
          onValueChange={(v) =>
            updateClinical({
              flexion_atr: { ...clinical.flexion_atr, position: v },
            })
          }
        />
        <TextField
          label="度数"
          type="number"
          value={clinical.flexion_atr.degree}
          onValueChange={(v) =>
            updateClinical({
              flexion_atr: { ...clinical.flexion_atr, degree: Number(v) },
            })
          }
        />
      </div>
    </FormGrid>
  );
};
