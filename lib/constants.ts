export const MEAL_OPTIONS = ["breakfast", "lunch", "dinner", "other"] as const;

export const MED_STATUS_OPTIONS = ["active", "paused", "stopped"] as const;
export const DX_STATUS_OPTIONS = ["active", "resolved", "monitoring"] as const;

export const CSV_TYPES = ["weights", "lab_tests", "medications", "diagnoses", "symptoms"] as const;

export type CsvType = (typeof CSV_TYPES)[number];
