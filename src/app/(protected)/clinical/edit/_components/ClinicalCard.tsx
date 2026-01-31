import { Card, CardContent } from "@mui/material";
import { ReactNode } from "react";

export const ClinicalCard = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="border-primary-100 border bg-white/60 shadow-md">
      <CardContent className="m-0 flex flex-col gap-2 py-1">
        {children}
      </CardContent>
    </Card>
  );
};
