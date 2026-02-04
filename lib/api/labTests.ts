import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { LabTestEntry } from "@/lib/types";

const TABLE = "lab_tests";

export async function listLabTests() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("entry_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as LabTestEntry[];
}

export async function createLabTest(payload: LabTestEntry) {
  assertSupabaseConfigured();
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data as LabTestEntry;
}

export async function updateLabTest(id: string, payload: Partial<LabTestEntry>) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as LabTestEntry;
}

export async function deleteLabTest(id: string) {
  assertSupabaseConfigured();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
