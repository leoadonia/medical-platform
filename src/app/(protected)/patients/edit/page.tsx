"use client";

import { FormGrid } from "@/app/_components/FormGrid";
import { BackHeader } from "@/components/BackHeader";
import { TextField } from "@/components/input/TextField";
import {
  createPatient,
  updatePatient as updatePatientToDB,
} from "@/lib/apis/patient";
import { validateUsingSchema } from "@/lib/schema";
import { usePatientStore } from "@/lib/stores/patient";
import {
  HeightSchema,
  PatientSchema,
  PhoneNumberSchema,
  WeightSchema,
} from "@/lib/types/patient";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BirthdayPicker } from "./_components/BirthdayPicker";
import { GenderForm } from "./_components/GenderForm";
import { GradeSelect } from "./_components/GradeSelect";
import { useEffect } from "react";

const EditPage = () => {
  const { patient, updatePatient } = usePatientStore();
  const router = useRouter();

  useEffect(() => {
    return () => {
      usePatientStore.getState().clearPatient();
    };
  }, []);

  const bmi = () => {
    if (patient.height && patient.weight) {
      const value = patient.weight / (patient.height / 100) ** 2;
      return Number(value.toFixed(1));
    }

    return 0;
  };

  const handleSubmit = async () => {
    const error = validateUsingSchema(PatientSchema, patient);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      if (patient.id === 0) {
        await createPatient(patient);
      } else {
        await updatePatientToDB(patient);
      }

      toast.success("保存成功");
      router.push("/patients");
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={3}>
      <BackHeader title={patient.id ? "编辑患者信息" : "新增患者"} />

      <Box className="flex flex-col gap-2 px-4">
        <FormGrid id="registration_number" label="登记号">
          <TextField
            id="registration_number"
            value={patient?.registration_number}
            label="必填"
            required
            className="min-w-xs"
            onValueChange={(v) => updatePatient({ registration_number: v })}
          />
        </FormGrid>
        <FormGrid id="name" label="姓名">
          <TextField
            id="name"
            value={patient?.name}
            label="必填"
            required
            className="min-w-xs"
            onValueChange={(v) => updatePatient({ name: v })}
          />
        </FormGrid>
        <FormGrid id="contact" label="联系电话(家长)">
          <TextField
            id="contact"
            value={patient?.contact}
            label="必填"
            required
            className="min-w-xs"
            onValueChange={(v) => updatePatient({ contact: v })}
            validator={{
              fn: (v) => validateUsingSchema(PhoneNumberSchema, v),
            }}
          />
        </FormGrid>
        <FormGrid id="height" label="身高">
          <TextField
            id="height"
            value={patient?.height}
            label="必填"
            required
            className="min-w-xs"
            type="number"
            endIcon={"cm"}
            onValueChange={(v) => updatePatient({ height: Number(v) })}
            validator={{
              fn: (v) => validateUsingSchema(HeightSchema, Number(v)),
            }}
          />
        </FormGrid>
        <FormGrid id="weight" label="体重">
          <TextField
            id="weight"
            value={patient?.weight}
            label="必填"
            required
            className="min-w-xs"
            type="number"
            endIcon={"kg"}
            onValueChange={(v) => updatePatient({ weight: Number(v) })}
            validator={{
              fn: (v) => validateUsingSchema(WeightSchema, Number(v)),
            }}
          />
        </FormGrid>
        <FormGrid id="bmi" label="BMI">
          <TextField
            id="bmi"
            className="min-w-xs"
            readonly
            value={bmi()}
            variant="standard"
            endIcon={"kg/m²"}
          />
        </FormGrid>
        <GenderForm />
        <BirthdayPicker />
        <GradeSelect />
        <FormGrid id="school" label="学校">
          <TextField
            id="school"
            value={patient?.school}
            fullWidth
            onValueChange={(v) => updatePatient({ school: v })}
          />
        </FormGrid>
        <Button
          className="from-primary-200 to-info-400 mx-auto mt-8 flex min-w-3xs bg-linear-to-r text-white"
          onClick={handleSubmit}
        >
          确定
        </Button>
      </Box>
    </Box>
  );
};

export default EditPage;
