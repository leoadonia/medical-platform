import { Box } from "@mui/material";
import { TopTreatment } from "./TopTreatment";
import { GrowthCard } from "./GrowthCard";

export const GrowthDistribution = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={4} pt={8}>
      <div className="text-primary-300 text-xl font-medium">新增趋势</div>
      <Box
        display={"flex"}
        gap={4}
        flexWrap={"wrap"}
        flexDirection={"row-reverse"}
        px={4}
      >
        <TopTreatment />
        <GrowthCard />
      </Box>
    </Box>
  );
};
