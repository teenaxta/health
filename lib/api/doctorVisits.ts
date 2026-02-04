import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { DoctorVisitEntry } from "@/lib/types";

const TABLE = "doctor_visits";

export async function listDoctorVisits() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("visit_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DoctorVisitEntry[];
}

export async function createDoctorVisit(payload: DoctorVisitEntry) {
  assertSupabaseConfigured();
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data as DoctorVisitEntry;
}

export async function updateDoctorVisit(id: string, payload: Partial<DoctorVisitEntry>) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DoctorVisitEntry;
}

export async function deleteDoctorVisit(id: string) {
  assertSupabaseConfigured();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
