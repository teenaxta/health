"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listSymptoms, createSymptom, updateSymptom, deleteSymptom } from "@/lib/api/symptoms";
import { SymptomEntry, SymptomSchema } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { formatDate, toDateInput } from "@/lib/utils";

const EMPTY_FORM: SymptomEntry = {
  entry_date: "",
  feelings: "",
  symptoms: "",
  notes: ""
};

export default function SymptomsPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["symptoms"], queryFn: listSymptoms });
  const [form, setForm] = useState<SymptomEntry>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createSymptom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["symptoms"] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SymptomEntry> }) =>
      updateSymptom(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["symptoms"] })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSymptom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["symptoms"] })
  });

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleEdit(entry: SymptomEntry) {
    setEditingId(entry.id ?? null);
    setForm({
      entry_date: entry.entry_date,
      feelings: entry.feelings,
      symptoms: entry.symptoms ?? "",
      notes: entry.notes ?? ""
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = SymptomSchema.parse(form);
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, payload: parsed });
    } else {
      await createMutation.mutateAsync(parsed);
    }
    resetForm();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Symptoms & Feelings" subtitle="Log how you feel day to day." />

      <Card title={editingId ? "Edit Check-In" : "Add Check-In"}>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
          <Input
            type="date"
            value={toDateInput(form.entry_date)}
            onChange={(event) => setForm({ ...form, entry_date: event.target.value })}
            required
          />
          <Input
            value={form.feelings}
            onChange={(event) => setForm({ ...form, feelings: event.target.value })}
            placeholder="How do you feel?"
            required
          />
          <Input
            value={form.symptoms ?? ""}
            onChange={(event) => setForm({ ...form, symptoms: event.target.value })}
            placeholder="Symptoms"
          />
          <div className="md:col-span-4">
            <Textarea
              rows={2}
              value={form.notes ?? ""}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Notes"
            />
          </div>
          <div className="flex gap-2 md:col-span-4">
            <Button type="submit">{editingId ? "Save Changes" : "Add Check-In"}</Button>
            {editingId && (
              <Button type="button" variant="soft" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card title="History" subtitle="Recent check-ins">
        <div className="space-y-3">
          {data.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-slate-100 bg-white/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{entry.feelings}</p>
                  <p className="text-xs text-slate-500">{formatDate(entry.entry_date)}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => handleEdit(entry)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => entry.id && deleteMutation.mutate(entry.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {entry.symptoms && <p className="mt-2 text-sm text-slate-500">Symptoms: {entry.symptoms}</p>}
              {entry.notes && <p className="mt-1 text-sm text-slate-500">Notes: {entry.notes}</p>}
            </div>
          ))}
          {data.length === 0 && <p className="text-sm text-slate-500">No check-ins yet.</p>}
        </div>
      </Card>
    </div>
  );
}
