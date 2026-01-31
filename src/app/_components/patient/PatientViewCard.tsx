import { displayPatientState } from "@/app/_lib/state";
import { Patient } from "@/lib/types/patient";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
} from "@mui/material";

const Item = ({ k, v }: { k: string; v: React.ReactNode }) => {
  return (
    <Grid container spacing={2} alignItems={"center"}>
      <Grid size={2}>
        <Chip className="bg-info-50 px-2" label={k}></Chip>
      </Grid>
      <Grid size={"grow"}>{v}</Grid>
    </Grid>
  );
};

export const PatientViewCard = ({
  patient,
  actions,
}: {
  patient: Patient;
  actions?: React.ReactNode;
}) => {
  return (
    <Card className="border-info-200 shadow-info-100 rounded-xl border bg-white/30 shadow-lg">
      <CardContent className="m-0 flex flex-col gap-2 p-4">
        <Item k="登记号" v={patient.registration_number} />
        <Item k="姓名" v={patient.name} />
        <Item k="状态" v={displayPatientState(patient.state)} />
      </CardContent>
      {actions && (
        <>
          <Divider />
          <CardActions>{actions}</CardActions>
        </>
      )}
    </Card>
  );
};
