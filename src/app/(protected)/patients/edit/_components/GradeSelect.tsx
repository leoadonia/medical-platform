import { FormGrid } from "@/app/_components/FormGrid";
import { usePatientStore } from "@/lib/stores/patient";
import { GradeOptions } from "@/lib/types/patient";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

export const GradeSelect = () => {
  const { patient, updatePatient } = usePatientStore();

  const handleChange = (e: SelectChangeEvent) => {
    updatePatient({ grade: e.target.value });
  };

  return (
    <FormGrid id="grade-label" label="年级">
      <Select
        labelId="grade-label"
        value={patient.grade}
        onChange={handleChange}
        className="min-w-3xs"
      >
        {GradeOptions.map((grade) => (
          <MenuItem key={grade} value={grade}>
            {grade}
          </MenuItem>
        ))}
      </Select>
    </FormGrid>
  );
};
