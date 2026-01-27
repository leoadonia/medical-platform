import { PaletteOptions } from "@mui/material/styles";
import { radixToMuiPalette } from "./utils";

const radixTealDark = {
  1: "hsl(175, 30%, 10%)",
  2: "hsl(175, 30%, 12%)",
  3: "hsl(175, 30%, 15%)",
  4: "hsl(175, 30%, 20%)",
  5: "hsl(175, 30%, 25%)",
  6: "hsl(175, 30%, 30%)",
  7: "hsl(175, 40%, 38%)",
  8: "hsl(175, 50%, 48%)", // ← main for dark mode
  9: "hsl(175, 60%, 58%)",
  10: "hsl(175, 60%, 68%)",
  11: "hsl(175, 60%, 80%)",
  12: "hsl(175, 60%, 90%)",
};

const radixCyanDark = {
  1: "hsl(188, 30%, 10%)",
  2: "hsl(188, 30%, 12%)",
  3: "hsl(188, 30%, 15%)",
  4: "hsl(188, 30%, 20%)",
  5: "hsl(188, 30%, 25%)",
  6: "hsl(188, 30%, 30%)",
  7: "hsl(188, 50%, 40%)",
  8: "hsl(188, 70%, 52%)", // ← main
  9: "hsl(188, 80%, 62%)",
  10: "hsl(188, 80%, 72%)",
  11: "hsl(188, 80%, 85%)",
  12: "hsl(188, 80%, 92%)",
};

const radixLimeDark = {
  1: "hsl(80, 25%, 8%)",
  2: "hsl(80, 25%, 10%)",
  3: "hsl(80, 25%, 13%)",
  4: "hsl(80, 25%, 18%)",
  5: "hsl(80, 25%, 23%)",
  6: "hsl(80, 25%, 28%)",
  7: "hsl(80, 50%, 38%)",
  8: "hsl(80, 65%, 48%)",
  9: "hsl(80, 75%, 58%)", // ← main (more stable than 10)
  10: "hsl(80, 75%, 68%)",
  11: "hsl(80, 75%, 80%)",
  12: "hsl(80, 75%, 90%)",
};

const radixAmberDark = {
  1: "hsl(40, 25%, 9%)",
  2: "hsl(40, 25%, 11%)",
  3: "hsl(40, 25%, 14%)",
  4: "hsl(40, 25%, 19%)",
  5: "hsl(40, 25%, 24%)",
  6: "hsl(40, 25%, 29%)",
  7: "hsl(40, 60%, 42%)",
  8: "hsl(40, 75%, 52%)",
  9: "hsl(40, 90%, 62%)", // ← main
  10: "hsl(40, 90%, 72%)",
  11: "hsl(40, 90%, 85%)",
  12: "hsl(40, 90%, 92%)",
};

const radixRubyDark = {
  1: "hsl(356, 25%, 10%)",
  2: "hsl(356, 25%, 12%)",
  3: "hsl(356, 25%, 15%)",
  4: "hsl(356, 25%, 20%)",
  5: "hsl(356, 25%, 25%)",
  6: "hsl(356, 25%, 30%)",
  7: "hsl(356, 50%, 42%)",
  8: "hsl(356, 70%, 54%)", // ← main
  9: "hsl(356, 80%, 64%)",
  10: "hsl(356, 80%, 74%)",
  11: "hsl(356, 80%, 86%)",
  12: "hsl(356, 80%, 92%)",
};

const radixPurpleDark = {
  1: "hsl(260, 25%, 10%)",
  2: "hsl(260, 25%, 12%)",
  3: "hsl(260, 25%, 15%)",
  4: "hsl(260, 25%, 20%)",
  5: "hsl(260, 25%, 25%)",
  6: "hsl(260, 25%, 30%)",
  7: "hsl(260, 50%, 42%)",
  8: "hsl(260, 65%, 52%)", // ← main
  9: "hsl(260, 70%, 62%)",
  10: "hsl(260, 70%, 72%)",
  11: "hsl(260, 70%, 85%)",
  12: "hsl(260, 70%, 92%)",
};

const radixSlateDark = {
  1: "hsl(215, 15%, 8%)",
  2: "hsl(215, 15%, 10%)",
  3: "hsl(215, 15%, 13%)",
  4: "hsl(215, 15%, 18%)",
  5: "hsl(215, 15%, 23%)",
  6: "hsl(215, 15%, 28%)",
  7: "hsl(215, 15%, 38%)",
  8: "hsl(215, 15%, 48%)",
  9: "hsl(215, 15%, 58%)",
  10: "hsl(215, 15%, 68%)",
  11: "hsl(215, 20%, 80%)",
  12: "hsl(215, 25%, 92%)",
};

// ====== Convert to MUI Palettes ======
const teal = radixToMuiPalette(radixTealDark);
const cyan = radixToMuiPalette(radixCyanDark);
const lime = radixToMuiPalette(radixLimeDark);
const amber = radixToMuiPalette(radixAmberDark);
const ruby = radixToMuiPalette(radixRubyDark);
const purple = radixToMuiPalette(radixPurpleDark);
const slate = radixToMuiPalette(radixSlateDark);

export const palette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: teal["800"], // Radix teal.8 (bright enough on dark bg)
    light: teal["700"],
    dark: teal["900"],
    contrastText: "#ffffff",
    ...teal,
  },
  secondary: {
    main: cyan["800"], // cyan.8
    light: cyan["700"],
    dark: cyan["900"],
    contrastText: "#ffffff",
    ...cyan,
  },
  success: {
    main: lime["900"], // lime.9 (more stable than 10 in dark)
    light: lime["800"],
    dark: lime["950"] || lime["900"], // fallback
    contrastText: "#ffffff",
    ...lime,
  },
  warning: {
    main: amber["900"], // amber.9
    light: amber["800"],
    dark: amber["950"] || amber["900"],
    contrastText: "#ffffff",
    ...amber,
  },
  error: {
    main: ruby["800"], // ruby.8
    light: ruby["700"],
    dark: ruby["900"],
    contrastText: "#ffffff",
    ...ruby,
  },
  info: {
    main: purple["800"], // purple.8
    light: purple["700"],
    dark: purple["900"],
    contrastText: "#ffffff",
    ...purple,
  },
  grey: slate,
  common: {
    black: "#000000",
    white: slate["100"], // off-white
  },
  text: {
    primary: slate["100"], // near-white
    secondary: slate["300"],
    disabled: slate["600"],
  },
  background: {
    paper: slate["900"], // card/dialog background
    default: slate["950"] || slate["900"], // page background
  },
  divider: slate["800"],
  action: {
    active: slate["100"],
    hover: teal["900"], // subtle highlight
    selected: teal["800"],
    disabled: slate["700"],
    disabledBackground: slate["800"],
  },
};
