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

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
