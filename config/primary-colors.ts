export const PRIMARY_COLOR_STORAGE_KEY = "vrx-primary-color";

export const PRIMARY_COLORS = [
  {
    name: "Red",
    value: "red",
    swatch: "oklch(0.577 0.245 27.325)",
  },
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
    name: "Pink",
    value: "pink",
    swatch: "oklch(0.558 0.244 333.0)",
  },
] as const;

export type PrimaryColor = (typeof PRIMARY_COLORS)[number]["value"];

export const DEFAULT_PRIMARY_COLOR: PrimaryColor = "blue";

export function isPrimaryColor(value: string | null): value is PrimaryColor {
  return PRIMARY_COLORS.some((color) => color.value === value);
}
