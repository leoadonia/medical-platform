import { FormLabel, Grid } from "@mui/material";

export const FormGrid = (props: {
  id: string;
  label: string;
  children: React.ReactNode;
}) => {
  const { id, label, children } = props;

  return (
    <Grid container spacing={2} alignItems={"center"}>
      <Grid size={2} minWidth={"64px"}>
        <FormLabel htmlFor={id} className="typography-subtitle1">
          {label}:
        </FormLabel>
      </Grid>
      <Grid size={"grow"}>{children}</Grid>
    </Grid>
  );
};
