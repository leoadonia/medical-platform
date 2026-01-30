"use client";

import {
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextProps,
} from "@mui/material";
import { useState } from "react";

export type TextValidationError = "valueMissing" | "typeMismatch";

export interface TextValidator {
  fn?: (value: string) => string | null;
  rules?: Partial<Record<TextValidationError, string>>;
}

export type TextFieldProps = MuiTextProps & {
  onValueChange?: (value: string) => void;
  validator?: TextValidator;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  readonly?: boolean;
};

export const TextField = (props: TextFieldProps) => {
  const {
    onValueChange,
    validator,
    startIcon,
    endIcon,
    readonly,
    helperText,
    label,
    slotProps,
    ...otherProps
  } = props;

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let error = validator?.fn?.(value) || null;
    if (!error) {
      // Try do some default validation.
      if (otherProps.required && !value) {
        error = validator?.rules?.["valueMissing"] || "请输入必填项";
      }
    }

    if (error) {
      setErrorMsg(error);
    } else {
      // Clear the error if the value is valid.
      setErrorMsg("");
    }

    onValueChange?.(value);
  };

  const buildLabel = () => {
    if (label) {
      return label;
    }

    if (otherProps.required) {
      return "Required";
    }

    return null;
  };

  const buildSlotProps = () => {
    let {
      input = {
        className: "rounded-[8px]",
      },
    } = slotProps ?? {};
    if (readonly) {
      input = {
        ...input,
        readOnly: true,
      };
    }

    if (startIcon) {
      input = {
        ...input,
        startAdornment: (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
      };
    }

    if (endIcon) {
      input = {
        ...input,
        endAdornment: <InputAdornment position="end">{endIcon}</InputAdornment>,
      };
    }

    return {
      ...slotProps,
      input,
    };
  };

  return (
    <MuiTextField
      {...otherProps}
      name={otherProps.id} // Using for the field name in FormData.
      onChange={handleChange}
      error={!!errorMsg}
      helperText={errorMsg || helperText}
      label={buildLabel()}
      slotProps={buildSlotProps()}
    />
  );
};
