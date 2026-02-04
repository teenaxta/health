import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { MedicationEntry } from "@/lib/types";

const TABLE = "medications";

export async function listMedications() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("start_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MedicationEntry[];
}

export async function createMedication(payload: MedicationEntry) {
  assertSupabaseConfigured();
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data as MedicationEntry;
}

export async function updateMedication(id: string, payload: Partial<MedicationEntry>) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as MedicationEntry;
}

export async function deleteMedication(id: string) {
  assertSupabaseConfigured();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
