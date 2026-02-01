import { FormGrid } from "@/app/_components/FormGrid";
import { TextField } from "@/components/input/TextField";
import { validateUsingSchema } from "@/lib/schema";
import { useClinicalStore } from "@/lib/stores/clinical";
import { CobbSchema } from "@/lib/types/clinical";

export const Cobb = () => {
  const { clinical, updateClinical } = useClinicalStore();

  return (
    <FormGrid id="cobb" label="Cobb角">
      <div className="flex flex-wrap gap-4">
        <TextField
          type="number"
          value={clinical.cobb.cobb}
          onValueChange={(v) =>
            updateClinical({ cobb: { ...clinical.cobb, cobb: Number(v) } })
          }
          validator={{
            fn: (v) => validateUsingSchema(CobbSchema, Number(v)),
          }}
        />
        <TextField
          value={clinical.cobb.remark}
          label="备注"
          onValueChange={(v) =>
            updateClinical({ cobb: { ...clinical.cobb, remark: v } })
          }
        />
      </div>
    </FormGrid>
  );
};
