import { NonEmptyStringSchema } from "@/lib/schema";
import { z } from "zod";

export const PatientStateOptions = [
  "Init",
  "StableMild",
  "StableModerate",
  "StableSerious",
  "ProgressiveMild",
  "ProgressiveModerate",
  "ProgressiveSerious",
  "MatureMild",
  "MatureModerate",
  "MatureSerious",
];

export const GenderOptions = ["男生", "女生"];
export const GenderSchema = z.enum(GenderOptions);

export const GradeOptions = [
  "一年级",
  "二年级",
  "三年级",
  "四年级",
  "五年级",
  "六年级",
  "初一",
  "初二",
  "初三",
];
export const GradeSchema = z.enum(GradeOptions);

export const MenarcheSchema = z
  .number()
  .int()
  .min(1, "请填写正确的年龄")
  .max(20, "请填写正确的年龄")
  .optional();

export const WeightSchema = z
  .number({ message: "必须是有效的数字!" })
  .min(1, "请填写正确的体重")
  .max(300, "请填写正确的体重");

export const HeightSchema = z
  .number({ message: "必须是有效的数字!" })
  .min(1, "请填写正确的身高")
  .max(250, "请填写正确的身高");

export const PhoneNumberSchema = z.string().length(11, "请填写正确的手机号");

export const PatientSchema = z.object({
  id: z.number(),
  state: z.enum(PatientStateOptions),
  registration_number: z.string(),
  name: NonEmptyStringSchema,
  contact: NonEmptyStringSchema,
  height: HeightSchema,
  weight: WeightSchema,
  gender: GenderSchema,
  birthday: z.number(),
  school: NonEmptyStringSchema,
  grade: GradeSchema,
  menarche: MenarcheSchema,
  created_at: z.number(),
});

export type Patient = z.infer<typeof PatientSchema>;

export const DefaultPatient: Patient = {
  id: 0,
  state: "Init",
  registration_number: "",
  name: "",
  contact: "",
  height: 0,
  weight: 0,
  gender: "",
  birthday: 0,
  school: "",
  grade: "",
  created_at: 0,
};

export interface SearchParams {
  name?: string;
  registration_number?: string;
  contact?: string;
}
