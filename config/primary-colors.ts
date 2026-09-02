export const PRIMARY_COLOR_STORAGE_KEY = "vrx-primary-color";

export const PRIMARY_COLORS = [
  {
    name: "Blue",
    value: "blue",
    swatch: "oklch(0.546 0.245 262.881)",
  },
  {
    name: "Green",
    value: "green",
    swatch: "oklch(0.731 0.179 128.2)",
  }
] as const;

export type PrimaryColor = (typeof PRIMARY_COLORS)[number]["value"];

export const DEFAULT_PRIMARY_COLOR: PrimaryColor = "green";

export function isPrimaryColor(value: string | null): value is PrimaryColor {
  return PRIMARY_COLORS.some((color) => color.value === value);
}
