import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { DiagnosisEntry } from "@/lib/types";

const TABLE = "diagnoses";

export async function listDiagnoses() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("diagnosis_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DiagnosisEntry[];
}

export async function createDiagnosis(payload: DiagnosisEntry) {
  assertSupabaseConfigured();
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data as DiagnosisEntry;
}

export async function updateDiagnosis(id: string, payload: Partial<DiagnosisEntry>) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DiagnosisEntry;
}

export async function deleteDiagnosis(id: string) {
  assertSupabaseConfigured();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
