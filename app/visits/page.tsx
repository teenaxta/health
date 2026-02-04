"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listDoctorVisits,
  createDoctorVisit,
  updateDoctorVisit,
  deleteDoctorVisit
} from "@/lib/api/doctorVisits";
import { DoctorVisitEntry, DoctorVisitSchema } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatDate, toDateInput } from "@/lib/utils";

const EMPTY_FORM: DoctorVisitEntry = {
  visit_date: "",
  doctor: "",
  diagnosis_summary: "",
  medications_summary: "",
  completed: null,
  weight_value: null,
  weight_unit: "",
  notes: ""
};

export default function VisitsPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["doctor_visits"], queryFn: listDoctorVisits });
  const [form, setForm] = useState<DoctorVisitEntry>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: createDoctorVisit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor_visits"] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DoctorVisitEntry> }) =>
      updateDoctorVisit(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor_visits"] })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctorVisit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor_visits"] })
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

  function handleEdit(entry: DoctorVisitEntry) {
    setEditingId(entry.id ?? null);
    setForm({
      visit_date: entry.visit_date,
      doctor: entry.doctor,
      diagnosis_summary: entry.diagnosis_summary ?? "",
      medications_summary: entry.medications_summary ?? "",
      completed: entry.completed ?? null,
      weight_value: entry.weight_value ?? null,
      weight_unit: entry.weight_unit ?? "",
      notes: entry.notes ?? ""
    });
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  const normalized: DoctorVisitEntry = {
      ...form,
      diagnosis_summary: form.diagnosis_summary?.trim() ? form.diagnosis_summary : null,
      medications_summary: form.medications_summary?.trim() ? form.medications_summary : null,
      notes: null
    };
    const parsed = DoctorVisitSchema.parse(normalized);
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
        <PageHeader
          title="Visits & Prescriptions"
          subtitle="Doctor, prescriptions, and diagnoses per visit."
        />
        <Button type="button" onClick={openNew}>
          Add Visit
        </Button>
      </div>

      <Card title="Visit History" subtitle="Most recent first">
        <div className="space-y-4">
          {data.map((visit) => (
            <div key={visit.id} className="rounded-2xl border border-slate-100 bg-white/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{visit.doctor}</p>
                  <p className="text-xs text-slate-500">{formatDate(visit.visit_date)}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => handleEdit(visit)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => visit.id && deleteMutation.mutate(visit.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Prescriptions</p>
                  {visit.medications_summary ? (
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {visit.medications_summary
                        .split(/\n|;|•|\\u2022|\t|\\r/)
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .map((item, idx) => (
                          <li key={`${visit.id}-med-${idx}`} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">—</p>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Diagnosis</p>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                    {visit.diagnosis_summary ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="text-sm text-slate-500">No visits logged yet.</p>}
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-[96vw] max-w-[720px] rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">
                {editingId ? "Edit Visit" : "Add Visit"}
              </h3>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
              <Input
                type="date"
                value={toDateInput(form.visit_date)}
                onChange={(event) => setForm({ ...form, visit_date: event.target.value })}
                required
              />
              <Input
                value={form.doctor}
                onChange={(event) => setForm({ ...form, doctor: event.target.value })}
                placeholder="Doctor name"
                required
              />
              <Textarea
                rows={3}
                value={form.medications_summary ?? ""}
                onChange={(event) => setForm({ ...form, medications_summary: event.target.value })}
                placeholder="Prescribed meds (name, dosage per day, duration). Example: Vonma 20mg x2 daily for 30 days."
              />
              <Textarea
                rows={3}
                value={form.diagnosis_summary ?? ""}
                onChange={(event) => setForm({ ...form, diagnosis_summary: event.target.value })}
                placeholder="Doctor's diagnosis"
              />
              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Save Changes" : "Add Visit"}</Button>
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
