"use client";

import { Box, useTheme } from "@mui/material";
import { Props } from "react-apexcharts";
import { BaseOptions, Chart, ChartProps } from "./types";

export type RadialBarProps = {
  color?: "info" | "success" | "primary" | "secondary";
  lineWidth?: "xs" | "md";
} & ChartProps;

export const RadialBar = (props: RadialBarProps) => {
  const { lineWidth = "xs" } = props;

  const theme = useTheme();
  const createRadialBar = (): Props => {
    const options = BaseOptions(theme);
    options.labels = props.x as string[];

    options.stroke = {
      lineCap: "round",
    };

    options.fill = {
      colors: [theme.palette[props.color || "success"].main],
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "radial",
        gradientToColors: [theme.palette.error.main],
        stops: [0, 100],
      },
    };

    switch (lineWidth) {
      case "xs": {
        options.plotOptions!.radialBar!.hollow!.size = "80%";
        break;
      }

      case "md": {
        options.plotOptions!.radialBar!.hollow!.size = "75%";
        break;
      }
    }

    return {
      options: options,
      series: props.y,
      type: "radialBar",
    };
  };

  const data: Props = createRadialBar();

  return (
    <Box sx={{ ...props.sx }}>
      <Chart {...data} />
    </Box>
  );
};

export const Line = (props: ChartProps) => {
  const theme = useTheme();
  const createLine = (): Props => {
    const options = BaseOptions(theme);
    options.xaxis!.categories = props.x as string[];
    options.stroke = {
      curve: "smooth",
      width: 2,
    };

    return {
      options: options,
      series: props.y,
      type: "line",
    };
  };

  const data: Props = createLine();
  return (
    <Box sx={{ ...props.sx }}>
      <Chart {...data} />
    </Box>
  );
};

export const ColumnBar = (props: ChartProps) => {
  const theme = useTheme();
  const createColumnBar = (): Props => {
    const options = BaseOptions(theme);
    options.xaxis!.categories = props.x as string[];
    options.title!.text = props.title;

    return {
      options: options,
      series: props.y,
      type: "bar",
    };
  };

  const data: Props = createColumnBar();
  return (
    <Box sx={{ ...props.sx }}>
      <Chart {...data} />
    </Box>
  );
};
