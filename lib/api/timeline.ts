import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { TimelineEvent } from "@/lib/types";

const VIEW = "events_timeline";

export async function listTimeline() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from(VIEW)
    .select("*")
    .order("entry_date", { ascending: false });

  if (error) {
    console.error(error);
    return [] as TimelineEvent[];
  }

  return (data ?? []) as TimelineEvent[];
}
