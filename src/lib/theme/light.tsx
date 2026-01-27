import { PaletteOptions } from "@mui/material/styles";
import { radixToMuiPalette } from "./utils";

// ====== Radix Color Definitions (1-12) ======

const radixTeal = {
  1: "hsl(175, 60%, 95%)",
  2: "hsl(175, 60%, 90%)",
  3: "hsl(175, 60%, 82%)",
  4: "hsl(175, 60%, 70%)",
  5: "hsl(175, 60%, 58%)",
  6: "hsl(175, 60%, 48%)",
  7: "hsl(175, 60%, 42%)",
  8: "hsl(175, 60%, 38%)",
  9: "hsl(175, 60%, 35%)", // main
  10: "hsl(175, 60%, 30%)",
  11: "hsl(175, 60%, 25%)",
  12: "hsl(175, 60%, 20%)",
};

const radixCyan = {
  1: "hsl(188, 80%, 95%)",
  2: "hsl(188, 80%, 90%)",
  3: "hsl(188, 80%, 82%)",
  4: "hsl(188, 80%, 70%)",
  5: "hsl(188, 80%, 58%)",
  6: "hsl(188, 80%, 48%)",
  7: "hsl(188, 80%, 42%)",
  8: "hsl(188, 80%, 38%)",
  9: "hsl(188, 80%, 35%)", // main
  10: "hsl(188, 80%, 30%)",
  11: "hsl(188, 80%, 25%)",
  12: "hsl(188, 80%, 20%)",
};

const radixLime = {
  1: "hsl(80, 75%, 95%)",
  2: "hsl(80, 75%, 90%)",
  3: "hsl(80, 75%, 82%)",
  4: "hsl(80, 75%, 70%)",
  5: "hsl(80, 75%, 58%)",
  6: "hsl(80, 75%, 48%)",
  7: "hsl(80, 75%, 42%)",
  8: "hsl(80, 75%, 38%)",
  9: "hsl(80, 75%, 35%)",
  10: "hsl(80, 75%, 32%)", // main (more stable)
  11: "hsl(80, 75%, 28%)",
  12: "hsl(80, 75%, 24%)",
};

const radixAmber = {
  1: "hsl(40, 90%, 96%)",
  2: "hsl(40, 90%, 92%)",
  3: "hsl(40, 90%, 85%)",
  4: "hsl(40, 90%, 75%)",
  5: "hsl(40, 90%, 65%)",
  6: "hsl(40, 90%, 55%)",
  7: "hsl(40, 90%, 48%)",
  8: "hsl(40, 90%, 44%)",
  9: "hsl(40, 90%, 40%)",
  10: "hsl(40, 90%, 38%)", // main
  11: "hsl(40, 90%, 34%)",
  12: "hsl(40, 90%, 30%)",
};

const radixRuby = {
  1: "hsl(356, 80%, 96%)",
  2: "hsl(356, 80%, 93%)",
  3: "hsl(356, 80%, 88%)",
  4: "hsl(356, 80%, 80%)",
  5: "hsl(356, 80%, 70%)",
  6: "hsl(356, 80%, 60%)",
  7: "hsl(356, 80%, 52%)",
  8: "hsl(356, 80%, 48%)",
  9: "hsl(356, 80%, 46%)", // main
  10: "hsl(356, 80%, 44%)",
  11: "hsl(356, 80%, 40%)",
  12: "hsl(356, 80%, 36%)",
};

const radixPurple = {
  1: "hsl(260, 70%, 96%)",
  2: "hsl(260, 70%, 92%)",
  3: "hsl(260, 70%, 85%)",
  4: "hsl(260, 70%, 75%)",
  5: "hsl(260, 70%, 65%)",
  6: "hsl(260, 70%, 55%)",
  7: "hsl(260, 70%, 48%)",
  8: "hsl(260, 70%, 44%)",
  9: "hsl(260, 70%, 42%)", // main
  10: "hsl(260, 70%, 38%)",
  11: "hsl(260, 70%, 34%)",
  12: "hsl(260, 70%, 30%)",
};

const radixSlate = {
  1: "hsl(215, 20%, 98%)",
  2: "hsl(215, 20%, 95%)",
  3: "hsl(215, 20%, 90%)",
  4: "hsl(215, 18%, 80%)",
  5: "hsl(215, 18%, 70%)",
  6: "hsl(215, 15%, 55%)",
  7: "hsl(215, 15%, 45%)",
  8: "hsl(215, 15%, 35%)",
  9: "hsl(215, 15%, 28%)",
  10: "hsl(215, 15%, 22%)",
  11: "hsl(215, 20%, 16%)",
  12: "hsl(215, 25%, 10%)",
};

// ====== Convert to MUI Palettes ======
const teal = radixToMuiPalette(radixTeal);
const cyan = radixToMuiPalette(radixCyan);
const lime = radixToMuiPalette(radixLime);
const amber = radixToMuiPalette(radixAmber);
const ruby = radixToMuiPalette(radixRuby);
const purple = radixToMuiPalette(radixPurple);
const slate = radixToMuiPalette(radixSlate);

export const palette: PaletteOptions = {
  mode: "light",
  primary: {
    main: teal["700"], // Radix teal.9
    light: teal["600"], // .8
    dark: teal["800"], // .10
    contrastText: "#ffffff",
    ...teal,
  },
  secondary: {
    main: cyan["700"], // Radix cyan.9
    light: cyan["600"],
    dark: cyan["800"],
    contrastText: "#ffffff",
    ...cyan,
  },
  success: {
    main: lime["800"], // Radix lime.10 (more stable)
    light: lime["700"], // .9
    dark: lime["900"], // .11
    contrastText: "#ffffff",
    ...lime,
  },
  warning: {
    main: amber["800"], // Radix amber.10
    light: amber["700"],
    dark: amber["900"],
    contrastText: "#ffffff",
    ...amber,
  },
  error: {
    main: ruby["700"], // Radix ruby.9
    light: ruby["600"],
    dark: ruby["800"],
    contrastText: "#ffffff",
    ...ruby,
  },
  info: {
    main: purple["700"], // Radix purple.9
    light: purple["600"],
    dark: purple["800"],
    contrastText: "#ffffff",
    ...purple,
  },
  grey: slate,
  common: {
    black: slate["900"],
    white: "#ffffff",
  },
  text: {
    primary: slate["900"],
    secondary: slate["700"],
    disabled: slate["500"],
  },
  background: {
    paper: slate["50"],
    default: slate["50"],
  },
  divider: slate["200"],
  action: {
    active: slate["900"],
    hover: teal["100"], // subtle primary tint
    selected: teal["200"],
    disabled: slate["400"],
    disabledBackground: slate["100"],
  },
};
