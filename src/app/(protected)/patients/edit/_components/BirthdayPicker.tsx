import { DatePicker } from "@/components/data/TimePicker";
import { usePatientStore } from "@/lib/stores/patient";
import { useMemo } from "react";
import { TextItem } from "./TextItem";

export const BirthdayPicker = () => {
  const { patient, updatePatient } = usePatientStore();
  const now = useMemo(() => {
    const date = new Date();
    return date.getTime();
  }, []);

  return (
    <TextItem id="birthday" label="出生年月">
      <DatePicker
        value={patient.birthday}
        maxDate={now}
        onChange={(v) => updatePatient({ birthday: v })}
        className="min-w-3xs"
      />
    </TextItem>
  );
};
