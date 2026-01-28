"use client";

import {
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextProps,
} from "@mui/material";
import { useState } from "react";

export type TextValidationError = "valueMissing" | "typeMismatch" | "default";

export interface TextValidator {
  fn?: (value: string) => TextValidationError | null;
  rules: Partial<Record<TextValidationError, string>>;
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
    ...rest
  } = props;

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let errorType = null;
    if (validator) {
      errorType = validator.fn?.(value);
    }

    if (!errorType) {
      if (rest.required && !value) {
        errorType = "valueMissing" as TextValidationError;
      }
    }

    if (errorType) {
      // The previous value should be clear if there is any error.
      onValueChange?.("");

      const err = validator?.rules[errorType];
      if (err) {
        setErrorMsg(err);
        return;
      }

      if (validator?.rules["default"]) {
        setErrorMsg(validator?.rules["default"]);
        return;
      }

      setErrorMsg(errorType);
      return;
    }

    // Clear the error if the value is valid.
    setErrorMsg("");
    onValueChange?.(value);
  };

  const buildLabel = () => {
    if (label) {
      return label;
    }

    if (rest.required) {
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
      {...rest}
      name={rest.id} // Using for the field name in FormData.
      onChange={handleChange}
      error={!!errorMsg}
      helperText={errorMsg || helperText}
      label={buildLabel()}
      slotProps={buildSlotProps()}
    />
  );
};
