import { Line } from "@/components/charts";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

export const GrowthCard = () => {
  return (
    <Card className="flex-1 border border-pink-200 bg-white/80 shadow-lg">
      <CardHeader
        title={
          <Typography color="info" variant="subtitle1">
            增长趋势
          </Typography>
        }
      />
      <CardContent>
        <Line
          x={["09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07"]}
          y={[
            {
              name: "新增人数",
              data: [20, 10, 11, 9, 0, 0, 32],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
