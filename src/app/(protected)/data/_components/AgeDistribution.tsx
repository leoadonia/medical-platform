import { Box, Button, Card, CardContent, Typography } from "@mui/material";

const DistributionCard = (props: {
  age: string;
  total: number;
  proportion: number;
  growth: string;
  symptom: string;
  variant: "info" | "error";
}) => {
  const variants = {
    info: "border-info-100 shadow-info-100",
    error: "border-error-200 shadow-error-50",
  };

  return (
    <Card
      className={`${variants[props.variant]} w-xs border-l-4 bg-white/50 shadow-lg`}
    >
      <CardContent>
        <Box display={"flex"} flexDirection={"column"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="subtitle1">{props.age}</Typography>
            <Button variant="text" color={props.variant}>
              <Typography variant="subtitle2"> 查看详情</Typography>
            </Button>
          </Box>
          <Box display={"flex"} gap={2} alignItems={"baseline"} mb={1}>
            <Typography variant="h5">{props.total}</Typography>
            <Typography variant="body2">{props.growth}</Typography>
          </Box>
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <Typography variant="caption" fontWeight={"bold"}>
              {props.proportion}%
            </Typography>
            <Typography variant="body2" color={"textSecondary"}>
              {props.symptom}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const AgeDistribution = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={4}>
      <div className="text-info-300 text-xl font-medium">年龄分布</div>
      <Box display={"flex"} gap={2} flexWrap={"wrap"} px={4}>
        <DistributionCard
          age="<6岁"
          total={250}
          proportion={25}
          growth="+10%"
          symptom="主要病症: 脊柱侧弯、生长发育问题"
          variant="info"
        />
        <DistributionCard
          age="6~10岁"
          total={220}
          proportion={22}
          growth="+15%"
          symptom="主要病症: 脊柱侧弯、生长发育问题"
          variant="error"
        />
        <DistributionCard
          age="10~14岁"
          total={400}
          proportion={40}
          growth="-15%"
          symptom="主要病症: 脊柱侧弯、生长发育问题"
          variant="info"
        />
        <DistributionCard
          age=">14岁"
          total={100}
          proportion={10}
          growth="-5%"
          symptom="主要病症: 脊柱侧弯、生长发育问题"
          variant="error"
        />
      </Box>
    </Box>
  );
};
