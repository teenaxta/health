import { z } from "zod";
import { DX_STATUS_OPTIONS, MED_STATUS_OPTIONS, MEAL_OPTIONS } from "./constants";

export const WeightSchema = z.object({
  id: z.string().uuid().optional(),
  entry_date: z.string().min(1),
  meal: z.enum(MEAL_OPTIONS).default("other"),
  value: z.number().positive().optional().nullable(),
  unit: z.string().min(1).default("kg"),
  source: z.string().optional().nullable(),
  menu: z.string().optional().nullable(),
  symptoms: z.string().optional().nullable(),
  calories: z.number().nonnegative().optional().nullable(),
  fat: z.number().nonnegative().optional().nullable(),
  protein: z.number().nonnegative().optional().nullable(),
  notes: z.string().optional().nullable()
});

export type WeightEntry = z.infer<typeof WeightSchema>;

export const LabTestSchema = z.object({
  id: z.string().uuid().optional(),
  entry_date: z.string().min(1),
  test_name: z.string().min(1),
  value: z.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  result_text: z.string().optional().nullable(),
  lab_name: z.string().optional().nullable(),
  problematic: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  reference_notes: z.string().optional().nullable(),
  ref_low: z.number().optional().nullable(),
  ref_high: z.number().optional().nullable(),
  notes: z.string().optional().nullable()
});

export type LabTestEntry = z.infer<typeof LabTestSchema>;

export const MedicationSchema = z.object({
  id: z.string().uuid().optional(),
  entry_date: z.string().min(1),
  prescribed_by: z.string().optional().nullable(),
  name: z.string().min(1),
  dose: z.number().positive().optional().nullable(),
  dose_unit: z.string().optional().nullable(),
  dose_count: z.number().positive().optional().nullable(),
  frequency: z.string().optional().nullable(),
  start_date: z.string().min(1),
  end_date: z.string().optional().nullable(),
  stop_date: z.string().optional().nullable(),
  status: z.enum(MED_STATUS_OPTIONS),
  notes: z.string().optional().nullable()
});

export type MedicationEntry = z.infer<typeof MedicationSchema>;

export const DiagnosisSchema = z.object({
  id: z.string().uuid().optional(),
  entry_date: z.string().min(1),
  name: z.string().min(1),
  diagnosis_date: z.string().min(1),
  status: z.enum(DX_STATUS_OPTIONS),
  provider: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export type DiagnosisEntry = z.infer<typeof DiagnosisSchema>;

export const SymptomSchema = z.object({
  id: z.string().uuid().optional(),
  entry_date: z.string().min(1),
  feelings: z.string().min(1),
  symptoms: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export type SymptomEntry = z.infer<typeof SymptomSchema>;

export const DoctorVisitSchema = z.object({
  id: z.string().uuid().optional(),
  visit_date: z.string().min(1),
  doctor: z.string().min(1),
  diagnosis_summary: z.string().optional().nullable(),
  medications_summary: z.string().optional().nullable(),
  completed: z.boolean().optional().nullable(),
  weight_value: z.number().optional().nullable(),
  weight_unit: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export type DoctorVisitEntry = z.infer<typeof DoctorVisitSchema>;

export type TimelineEvent = {
  id: string;
  entry_date: string;
  category: "weight" | "lab_test" | "medication" | "diagnosis" | "visit" | "symptom";
  title: string;
  subtitle: string;
  notes?: string | null;
};
