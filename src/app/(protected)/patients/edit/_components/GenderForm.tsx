import { FormGrid } from "@/app/_components/FormGrid";
import { TextField } from "@/components/input/TextField";
import { validateUsingSchema } from "@/lib/schema";
import { usePatientStore } from "@/lib/stores/patient";
import { GenderOptions, MenarcheSchema } from "@/lib/types/patient";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  SelectChangeEvent,
} from "@mui/material";

export const GenderForm = () => {
  const { patient, updatePatient } = usePatientStore();

  const handleGenderChange = (event: SelectChangeEvent) => {
    updatePatient({ gender: event.target.value });
  };

  return (
    <>
      <FormGrid id="gender" label="性别">
        <RadioGroup
          row
          value={patient.gender}
          name="gender"
          aria-labelledby="gender"
          onChange={handleGenderChange}
        >
          {GenderOptions.map((gender) => (
            <FormControlLabel
              key={gender}
              value={gender}
              control={<Radio color="info" />}
              label={gender}
            />
          ))}
        </RadioGroup>
      </FormGrid>
      {patient.gender === GenderOptions[1] && (
        <FormGrid id="menarche" label="初潮年龄">
          <TextField
            type="number"
            value={patient.menarche || ""}
            onValueChange={(v) => updatePatient({ menarche: Number(v) })}
            validator={{
              fn: (v) => validateUsingSchema(MenarcheSchema, Number(v)),
            }}
          />
        </FormGrid>
      )}
    </>
  );
};
