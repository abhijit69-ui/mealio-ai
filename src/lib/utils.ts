import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toStringSafe = (
  value: string | number | null | undefined | unknown,
): string => {
  return value === null ? "" : String(value);
};

export const toNumberSafe = (
  value: string | number | null | undefined,
): number => {
  if (value === null) return 0;
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};
