import { FormGrid } from "@/components/data/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Box } from "@mui/material";

export const Balance = () => {
  const { clinical, updateClinical } = useClinicalStore();

  return (
    <FormGrid id="balance" label="平衡能力">
      <Box display={"flex"} flexWrap={"wrap"} gap={4}>
        <TextField
          label="左"
          type="number"
          value={clinical.balance.left}
          onValueChange={(v) =>
            updateClinical({
              balance: {
                ...clinical.balance,
                left: Number(v),
              },
            })
          }
        />
        <TextField
          label="右"
          type="number"
          value={clinical.balance.right}
          onValueChange={(v) =>
            updateClinical({
              balance: {
                ...clinical.balance,
                right: Number(v),
              },
            })
          }
        />
      </Box>
    </FormGrid>
  );
};
