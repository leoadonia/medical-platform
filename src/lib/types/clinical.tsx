import z from "zod";

export const SkinComplicationOptions = ["压疮", "过敏"];

export const TreatmentOptions = [
  "手术",
  "佩戴器具",
  "康复训练",
  "推拿",
  "其他",
];

export const ExerciseOptions = [
  "游泳",
  "跑步",
  "核心训练",
  "跳绳",
  "骑车",
  "其他",
];
const ExerciseSchema = z.object({
  type: z.string(), // manual input is supported.
  frequency: z.number().min(1, "请填写锻炼频率"),
});

// 支具
export const BraceSchema = z.object({
  type: z.string(),
  daily_duration: z.number(),
  // 皮肤并发症
  skin_complications: z.string(),
});

// 脊椎活动度
const MobilitySchema = z.object({
  // 前屈
  flexion: z.number(),
  // 后伸
  extension: z.number(),
  // 左右侧屈
  lateral: z.number(),
  // 左右旋转
  rotation: z.number(),
});

// 平衡能力
const BalanceSchema = z.object({
  left: z.number(),
  right: z.number(),
});

const FlexionAtrSchema = z.object({
  position: z.string(),
  degree: z.number(),
});

export const PostureLevelOptions = ["", "左侧高", "右侧高"];

const PostureSchema = z.object({
  head_centered: z.string(),
  // 肩峰端是否等高. Which side is higher.
  acromial_level: z.string(),
  // 肩胛下角是否等高.
  scapula_level: z.string(),
  pelvis_level: z.string(),
  // 驼背
  kyphosis: z.boolean(),
  // 平背
  flatback: z.boolean(),
});

export const CobbSchema = z
  .number()
  .min(10, "请正确填写 Cobb 角, 范围是 10 ~ 40")
  .max(40, "请正确填写 Cobb 角, 范围是 10 ~ 40");

// 下肢长度
const ExtremitySchema = z.object({
  left: z.number().min(1, "请填写左下肢长度"),
  right: z.number().min(1, "请填写右下肢长度"),
});

export const ClinicalSchema = z.object({
  id: z.number(),
  patient_id: z.number(),
  brace: BraceSchema.optional(),
  treatment: z.string(), // manual input is supported.
  exercise: ExerciseSchema.optional(),
  mobility: MobilitySchema,
  balance: BalanceSchema,
  tenderness: z.string(), // 压痛
  percussion: z.string(), // 扣痛
  posture: PostureSchema,
  flexion_atr: FlexionAtrSchema,
  cobb: z.object({
    cobb: CobbSchema,
    remark: z.string(),
  }),
  pain_rate: z.number().min(1).max(10),
  extremity: ExtremitySchema,
  risser: z.number().min(1).max(5),
  created_at: z.number(),
});

export type Clinical = z.infer<typeof ClinicalSchema>;

export const DefaultClinical: Clinical = {
  id: 0,
  patient_id: 0,
  treatment: "",
  mobility: {
    flexion: 0,
    extension: 0,
    lateral: 0,
    rotation: 0,
  },
  balance: {
    left: 0,
    right: 0,
  },
  tenderness: "",
  percussion: "",
  posture: {
    head_centered: "",
    acromial_level: "",
    scapula_level: "",
    pelvis_level: "",
    kyphosis: false,
    flatback: false,
  },
  flexion_atr: {
    position: "",
    degree: 0,
  },
  cobb: {
    cobb: 0,
    remark: "",
  },
  pain_rate: 1,
  extremity: {
    left: 0,
    right: 0,
  },
  risser: 0,
  created_at: 0,
};
