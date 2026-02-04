"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listLabTests,
  createLabTest,
  updateLabTest,
  deleteLabTest
} from "@/lib/api/labTests";
import { LabTestEntry, LabTestSchema } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatDate, toDateInput } from "@/lib/utils";

const EMPTY_FORM: LabTestEntry = {
  entry_date: "",
  test_name: "",
  value: null,
  unit: "",
  result_text: "",
  lab_name: "",
  problematic: "",
  category: "procedure",
  reference_notes: "",
  ref_low: null,
  ref_high: null,
  notes: ""
};

export default function ProceduresPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["lab_tests"], queryFn: listLabTests });
  const [form, setForm] = useState<LabTestEntry>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const procedures = data.filter(
    (entry) =>
      entry.category === "procedure" || /mri|endoscopy|colonoscopy|biopsy/i.test(entry.test_name)
  );

  const createMutation = useMutation({
    mutationFn: createLabTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab_tests"] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<LabTestEntry> }) =>
      updateLabTest(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab_tests"] })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLabTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab_tests"] })
  });

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalOpen(false);
  }

  function openNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalOpen(true);
  }

  function handleEdit(entry: LabTestEntry) {
    setEditingId(entry.id ?? null);
    setForm({
      entry_date: entry.entry_date,
      test_name: entry.test_name,
      value: null,
      unit: "",
      result_text: entry.result_text ?? "",
      lab_name: entry.lab_name ?? "",
      problematic: entry.problematic ?? "",
      category: "procedure",
      reference_notes: entry.reference_notes ?? "",
      ref_low: null,
      ref_high: null,
      notes: entry.notes ?? ""
    });
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = LabTestSchema.parse({ ...form, category: "procedure" });
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, payload: parsed });
    } else {
      await createMutation.mutateAsync(parsed);
    }
    resetForm();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title="Procedures & Imaging" subtitle="MRI, endoscopy, colonoscopy and more." />
        <Button type="button" onClick={openNew}>
          Add Procedure
        </Button>
      </div>

      <Card title="Procedures" subtitle="Major procedures and imaging">
        <div className="space-y-4">
          {procedures.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-slate-100 bg-white/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{entry.test_name}</p>
                  <p className="text-xs text-slate-500">{formatDate(entry.entry_date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{entry.lab_name ?? "—"}</span>
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
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Findings</p>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                    {entry.result_text ?? "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Interpretation & Notes
                  </p>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                    {entry.reference_notes ?? entry.notes ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {procedures.length === 0 && (
            <p className="text-sm text-slate-500">No procedures logged yet.</p>
          )}
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-[96vw] max-w-[900px] rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">
                {editingId ? "Edit Procedure" : "Add Procedure"}
              </h3>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
              <Input
                type="date"
                value={toDateInput(form.entry_date)}
                onChange={(event) => setForm({ ...form, entry_date: event.target.value })}
                required
              />
              <Input
                value={form.test_name}
                onChange={(event) => setForm({ ...form, test_name: event.target.value })}
                placeholder="Procedure name"
                required
              />
              <Input
                value={form.lab_name ?? ""}
                onChange={(event) => setForm({ ...form, lab_name: event.target.value })}
                placeholder="Lab / Facility"
              />
              <div />
              <div className="md:col-span-2">
                <Textarea
                  rows={4}
                  value={form.result_text ?? ""}
                  onChange={(event) => setForm({ ...form, result_text: event.target.value })}
                  placeholder="Findings"
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  rows={4}
                  value={form.reference_notes ?? ""}
                  onChange={(event) => setForm({ ...form, reference_notes: event.target.value })}
                  placeholder="Interpretation & Notes"
                />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit">{editingId ? "Save Changes" : "Add Procedure"}</Button>
                <Button type="button" variant="soft" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
