export const radixToMuiPalette = (radixHslMap: Record<number, string>) => {
  const mapping: Record<string, number> = {
    "50": 2,
    "100": 3,
    "200": 4,
    "300": 5,
    "400": 6,
    "500": 7,
    "600": 8,
    "700": 9,
    "800": 10,
    "900": 11,
  };

  const muiPalette: Record<string, string> = {};
  for (const [muiKey, radixScale] of Object.entries(mapping)) {
    muiPalette[muiKey] = radixHslMap[radixScale];
  }
  return muiPalette;
};
