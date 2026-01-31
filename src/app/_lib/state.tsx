import { PatientStateOptions } from "@/lib/types/patient";
import { Avatar, Chip } from "@mui/material";

export const displayPatientState = (state: string): React.ReactNode => {
  switch (state) {
    case PatientStateOptions[0]:
      return <Chip className="bg-gray-100" label={"已录入"} />;

    case PatientStateOptions[1]:
      return (
        <Chip
          className="bg-info-100"
          label={"平稳期"}
          avatar={<Avatar className="bg-success-400 text-white">轻</Avatar>}
        />
      );

    case PatientStateOptions[2]:
      return (
        <Chip
          className="bg-info-100"
          label={"平稳期"}
          avatar={<Avatar className="bg-warning-400">中</Avatar>}
        />
      );

    case PatientStateOptions[3]:
      return (
        <Chip
          className="bg-info-100"
          label={"平稳期"}
          avatar={<Avatar className="bg-error-400 text-white">重</Avatar>}
        />
      );

    case PatientStateOptions[4]:
      return (
        <Chip
          className="bg-secondary-100"
          label={"进展期"}
          avatar={<Avatar className="bg-success-400 text-white">轻</Avatar>}
        />
      );

    case PatientStateOptions[5]:
      return (
        <Chip
          className="bg-secondary-100"
          label={"进展期"}
          avatar={<Avatar className="bg-warning-400">中</Avatar>}
        />
      );

    case PatientStateOptions[6]:
      return (
        <Chip
          className="bg-secondary-100"
          label={"进展期"}
          avatar={<Avatar className="bg-error-400 text-white">重</Avatar>}
        />
      );

    case PatientStateOptions[7]:
      return (
        <Chip
          className="bg-success-100"
          label={"成熟期"}
          avatar={<Avatar className="bg-success-400 text-white">轻</Avatar>}
        />
      );

    case PatientStateOptions[8]:
      return (
        <Chip
          className="bg-success-100"
          label={"成熟期"}
          avatar={<Avatar className="bg-warning-400">中</Avatar>}
        />
      );

    case PatientStateOptions[9]:
      return (
        <Chip
          className="bg-success-100"
          label={"成熟期"}
          avatar={<Avatar className="bg-error-400 text-white">重</Avatar>}
        />
      );
  }

  return <></>;
};
