"use client";

import { SxProps, Theme } from "@mui/material";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

export const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const BaseOptions = (theme: Theme): ApexOptions => ({
  colors: [
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ],
  chart: {
    fontFamily: theme.typography.fontFamily,
    foreColor: theme.palette.text.secondary,
    background: "transparent",
  },
  grid: {
    borderColor: theme.palette.divider,
  },
  xaxis: {
    labels: {
      style: {
        fontSize: theme.typography.body2.fontSize as string,
        fontFamily: theme.typography.fontFamily,
        colors: theme.palette.text.primary,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: theme.typography.body2.fontSize as string,
        fontFamily: theme.typography.fontFamily,
        colors: theme.palette.text.primary,
      },
    },
  },
  tooltip: {
    theme: "light",
    style: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.body2.fontSize as string,
    },
  },
  title: {
    align: "center",
    style: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.subtitle2.fontSize as string,
      fontWeight: theme.typography.subtitle2.fontWeight,
      color: theme.palette.error.main,
    },
  },
  plotOptions: {
    radialBar: {
      // Shape.
      startAngle: -135,
      endAngle: 135,

      hollow: {
        size: "80%",
      },

      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: theme.typography.body2.fontSize as string,
          fontFamily: theme.typography.body2.fontFamily,
        },
        value: {
          show: true,
          fontSize: theme.typography.body1.fontSize as string,
          fontFamily: theme.typography.body1.fontFamily,
          color: theme.palette.success.main,
        },
      },
    },
    bar: {
      columnWidth: "24px",
      borderRadius: 4,
    },
  },
});

export type ChartProps = {
  title?: string;
  x: unknown;
  y: ApexOptions["series"];
  sx?: SxProps;
};
