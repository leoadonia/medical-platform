"use client";

import {
  LocalizationProvider,
  DatePicker as MuiDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useState } from "react";

export const DatePicker = (props: {
  value?: number;
  maxDate?: number;
  minDate?: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  // Using `null` as the default value rather than `undefined` to avoid the error:
  //
  // MUI X: A component is changing the uncontrolled value of a Picker to be controlled.
  // Elements should not switch from uncontrolled to controlled (or vice versa).
  // Decide between using a controlled or uncontrolled value for the lifetime of the component.
  // The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.
  //
  // `undefined` is considered as uncontrolled value.
  const [value, setValue] = useState(props.value ? dayjs(props.value) : null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <MuiDatePicker
        className={props.className}
        slotProps={{
          textField: {
            size: "small",
          },
        }}
        onChange={(v) => {
          if (v) {
            setValue(v);
            props.onChange(v.unix() * 1000);
          }
        }}
        value={value}
        maxDate={props.maxDate ? dayjs(props.maxDate) : undefined}
        minDate={props.minDate ? dayjs(props.minDate) : undefined}
      />
    </LocalizationProvider>
  );
};
