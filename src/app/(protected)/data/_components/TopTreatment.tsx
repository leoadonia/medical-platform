import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { Circle, ExternalLink } from "lucide-react";

const Treatment = (props: {
  title: string;
  proportion: number;
  total: number;
  color: "primary" | "secondary" | "success";
}) => {
  const variants = {
    primary: "text-primary-400",
    secondary: "text-secondary-400",
    success: "text-success-400",
  };

  return (
    <Box display={"flex"} justifyContent={"space-between"}>
      <Box display={"flex"} gap={4} alignItems={"center"}>
        <Circle className={`${variants[props.color]} h-2 w-2`} />
        <Box display={"flex"} flexDirection={"column"} textAlign={"start"}>
          <Typography variant="body1">{props.title}</Typography>
          <Typography variant="body2" color={props.color}>
            {props.total} 人
          </Typography>
        </Box>
      </Box>
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <Box width={100}>
          <LinearProgress
            variant="determinate"
            value={props.proportion}
            color={props.color}
          />
        </Box>
        <Typography variant="body2" fontWeight={"bold"}>
          {props.proportion}%
        </Typography>
        <Tooltip title="查看详情">
          <IconButton color={props.color}>
            <ExternalLink className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export const TopTreatment = () => {
  return (
    <Box minWidth={320}>
      <Card className="border-primary-50 border bg-white/60 shadow-lg">
        <CardHeader
          title={
            <Typography color="info" variant="subtitle1">
              主要治疗方式
            </Typography>
          }
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Treatment
            title="物理矫正"
            proportion={50}
            total={500}
            color="primary"
          />
          <Treatment
            title="课程训练"
            proportion={30}
            total={300}
            color="secondary"
          />
          <Treatment
            title="支具治疗"
            proportion={20}
            total={200}
            color="success"
          />
        </CardContent>
      </Card>
    </Box>
  );
};
