import dayjs from "dayjs";

export const formatAgeFromBirthday = (birthday: number): number => {
  const birthDate = dayjs(birthday);
  if (!birthDate.isValid()) {
    return -1;
  }

  const today = dayjs();
  const age = today.diff(birthDate, "year");

  return age;
};
