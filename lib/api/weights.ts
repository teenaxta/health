import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { WeightEntry } from "@/lib/types";

const TABLE = "weights";

export async function listWeights() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("entry_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as WeightEntry[];
}

export async function createWeight(payload: WeightEntry) {
  assertSupabaseConfigured();
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data as WeightEntry;
}

export async function updateWeight(id: string, payload: Partial<WeightEntry>) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as WeightEntry;
}

export async function deleteWeight(id: string) {
  assertSupabaseConfigured();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
