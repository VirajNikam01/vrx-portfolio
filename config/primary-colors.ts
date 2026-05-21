export const PRIMARY_COLOR_STORAGE_KEY = "vrx-primary-color";

export const PRIMARY_COLORS = [
  {
    name: "Blue",
    value: "blue",
    swatch: "oklch(0.546 0.245 262.881)",
  },
  {
    name: "Violet",
    value: "violet",
    swatch: "oklch(0.541 0.281 293.009)",
  },
  {
    name: "Emerald",
    value: "emerald",
    swatch: "oklch(0.596 0.145 163.225)",
  },
  {
    name: "Rose",
    value: "rose",
    swatch: "oklch(0.586 0.253 17.585)",
  },
  {
    name: "Amber",
    value: "amber",
    swatch: "oklch(0.666 0.179 58.318)",
  },
] as const;

export type PrimaryColor = (typeof PRIMARY_COLORS)[number]["value"];

export const DEFAULT_PRIMARY_COLOR: PrimaryColor = "blue";

export function isPrimaryColor(value: string | null): value is PrimaryColor {
  return PRIMARY_COLORS.some((color) => color.value === value);
}
