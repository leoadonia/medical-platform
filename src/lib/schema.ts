import z from "zod";

export const NonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, "不能为空!")
  .max(64, "最多支持64个字符!");

export const validateUsingSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): string | null => {
  const result = schema.safeParse(data);
  if (result.success) {
    return null;
  }

  const issue = result.error.issues[0];
  if (issue.path.length === 0) {
    return issue.message;
  }

  return `${issue.path.join(",")}: ${issue.message}`;
};
