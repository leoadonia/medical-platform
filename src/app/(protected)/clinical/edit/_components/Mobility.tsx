import { FormGrid } from "@/app/_components/FormGrid";
import { TextField } from "@/components/input/TextField";
import { useClinicalStore } from "@/lib/stores/clinical";
import { Box } from "@mui/material";

export const Mobility = () => {
  const { clinical, updateClinical } = useClinicalStore();

  return (
    <FormGrid id="mobility" label="脊椎活动度">
      <Box display={"flex"} flexWrap={"wrap"} gap={4}>
        <TextField
          label="前屈"
          type="number"
          value={clinical.mobility.flexion}
          onValueChange={(v) =>
            updateClinical({
              mobility: { ...clinical.mobility, flexion: Number(v) },
            })
          }
        />
        <TextField
          label="后伸"
          type="number"
          value={clinical.mobility.extension}
          onValueChange={(v) =>
            updateClinical({
              mobility: { ...clinical.mobility, extension: Number(v) },
            })
          }
        />
        <TextField
          label="左右侧屈"
          type="number"
          value={clinical.mobility.lateral}
          onValueChange={(v) =>
            updateClinical({
              mobility: { ...clinical.mobility, lateral: Number(v) },
            })
          }
        />
        <TextField
          label="左右旋转"
          type="number"
          value={clinical.mobility.rotation}
          onValueChange={(v) =>
            updateClinical({
              mobility: { ...clinical.mobility, rotation: Number(v) },
            })
          }
        />
      </Box>
    </FormGrid>
  );
};
