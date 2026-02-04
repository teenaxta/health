import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { SymptomEntry } from "@/lib/types";

const TABLE = "symptoms";

export async function listSymptoms() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("entry_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SymptomEntry[];
}

export async function createSymptom(payload: SymptomEntry) {
  assertSupabaseConfigured();
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data as SymptomEntry;
}

export async function updateSymptom(id: string, payload: Partial<SymptomEntry>) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as SymptomEntry;
}

export async function deleteSymptom(id: string) {
  assertSupabaseConfigured();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
