"use client";

import { createTheme, PaletteOptions } from "@mui/material";
import { palette as darkPalette } from "./dark";
import { palette as lightPalette } from "./light";

const spaces = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64];

const createBaseTheme = (palette: PaletteOptions) =>
  createTheme({
    cssVariables: true, // !!! Important, otherwise MUI tokens does not work in Tailwind CSS classes.
    palette,
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Source Han"',
        '"Segoe UI (Custom)"',
        "Roboto",
        '"Helvetica Neue"',
        '"Open Sans (Custom)"',
        "system-ui",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
      ].join(","),
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      body2: {
        fontSize: "12px",
        letterSpacing: "0.0025em",
        lineHeight: "16px",
      },
      body1: {
        fontSize: "14px",
        letterSpacing: 0,
        lineHeight: "20px",
      },
      subtitle2: {
        fontSize: "12px",
        letterSpacing: "0.0025em",
        lineHeight: "16px",
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: "14px",
        letterSpacing: 0,
        lineHeight: "20px",
        fontWeight: 500,
      },
      h6: {
        fontSize: "16px",
        letterSpacing: 0,
        lineHeight: "24px",
        fontWeight: 500,
      },
      h5: {
        fontSize: "18px",
        letterSpacing: "-0.0025em",
        lineHeight: "26px",
        fontWeight: 500,
      },
      h4: {
        fontSize: "20px",
        letterSpacing: "-0.005em",
        lineHeight: "28px",
        fontWeight: 500,
      },
      h3: {
        fontSize: "24px",
        letterSpacing: "-0.00625em",
        lineHeight: "30px",
        fontWeight: 500,
      },
      h2: {
        fontSize: "28px",
        letterSpacing: "-0.0075em",
        lineHeight: "36px",
        fontWeight: 500,
      },
      h1: {
        fontSize: "35px",
        letterSpacing: "-0.01em",
        lineHeight: "40px",
        fontWeight: 500,
      },
      caption: {
        // Helper text.
        fontSize: "12px",
        lineHeight: "14px",
        letterSpacing: "0.0025em",
        fontStyle: "italic",
        fontWeight: 300,
      },
      overline: {
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "0.0025em",
        lineHeight: "14px",
        textTransform: "uppercase",
      },
      button: {
        fontWeight: 500,
      },
    },
    // spacing: spaces,
    spacing: 4, // The basis unit.
    components: {
      MuiButton: {
        defaultProps: {
          size: "medium",
          variant: "contained",
        },
        styleOverrides: {
          root: {
            textTransform: "none", // Do not transform text to uppercase
            fontSize: "14px",
            letterSpacing: 0,
            lineHeight: "20px",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: spaces[4],
            paddingRight: spaces[4],
            borderRadius: spaces[2],
          },
          startIcon: {
            marginRight: "2px",
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          sizeSmall: {
            padding: "6.25px",
          },
        },
      },
      MuiButtonGroup: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
          margin: "dense",
          slotProps: {
            htmlInput: {
              autoCapitalize: "none",
            },
          },
        },
      },
      MuiInputLabel: {
        // Helper text.
        defaultProps: {
          margin: "dense",
        },
        styleOverrides: {
          root: {
            fontSize: "12px", // H5
            letterSpacing: 0,
            lineHeight: "18px",
          },
        },
      },
      MuiInputBase: {
        defaultProps: {
          margin: "dense",
        },
        styleOverrides: {
          root: {
            fontSize: "14px", // H5
            letterSpacing: 0,
            lineHeight: "20px",
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          maxWidth: "xs",
        },
        styleOverrides: {
          paper: {
            borderRadius: spaces[3],
            minWidth: "30vw",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: spaces[5],
            fontSize: "20px",
          },
        },
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: 0,
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          dot: {
            height: "6px",
            minWidth: "6px",
            top: "4px",
            right: "4px",
          },
          standard: {
            height: "16px",
            minWidth: "16px",
            padding: 0,
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          size: "small",
        },
      },
      MuiPagination: {
        defaultProps: {
          size: "small",
        },
      },
      MuiChip: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            fontSize: "12px",
            letterSpacing: "0.0025em",
            lineHeight: "16px",
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          slotProps: {
            paper: {
              sx: {
                borderRadius: 2,
                minWidth: "10vw",
                margin: 0,
                paddingX: 2,
              },
            },
          },
        },
      },
      MuiMenuItem: {
        defaultProps: {
          dense: true,
          sx: {
            fontSize: "14px", // H5
            letterSpacing: 0,
            lineHeight: "20px",
            margin: 0,
            padding: 2,
            borderRadius: 2,
            height: spaces[6],
          },
        },
      },
      MuiSvgIcon: {
        defaultProps: {
          fontSize: "small",
        },
        styleOverrides: {
          root: {
            width: 15,
            height: "auto",
            aspectRatio: 1, // width === height
          },
        },
      },
      MuiFab: {
        defaultProps: {
          size: "small",
        },
      },
      MuiFormControl: {
        defaultProps: {
          size: "small",
          margin: "dense",
        },
      },
      MuiFormHelperText: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiRadio: {
        defaultProps: {
          size: "small",
        },
      },
      MuiSwitch: {
        defaultProps: {
          size: "small",
        },
      },
      MuiList: {
        defaultProps: {
          dense: true,
        },
      },
      MuiTable: {
        defaultProps: {
          size: "small",
        },
      },
      MuiCard: {
        defaultProps: {
          sx: {
            borderRadius: 4,
          },
        },
      },
      MuiCardHeader: {
        defaultProps: {
          slotProps: {
            title: {
              variant: "subtitle1",
            },
            subheader: {
              variant: "subtitle2",
            },
          },
        },
      },
      MuiCardContent: {
        defaultProps: {
          sx: {
            py: 2,
            px: 4,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            textAlign: "center",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: "auto", // Needed.
            minWidth: "auto",
            textTransform: "none",
            fontSize: "12px", // body2
            letterSpacing: "0.0025em",
            lineHeight: "16px",
          },
        },
      },
    },
  });

export const lightTheme = createBaseTheme(lightPalette);
export const darkTheme = createBaseTheme(darkPalette);
