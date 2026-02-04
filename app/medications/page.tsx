"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listMedications, createMedication, updateMedication, deleteMedication } from "@/lib/api/medications";
import { MedicationEntry, MedicationSchema } from "@/lib/types";
import { MED_STATUS_OPTIONS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatNumber, toDateInput } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";

const EMPTY_FORM: MedicationEntry = {
  entry_date: "",
  prescribed_by: "",
  name: "",
  dose: null,
  dose_unit: "",
  dose_count: null,
  frequency: "",
  start_date: "",
  end_date: null,
  stop_date: null,
  status: "active",
  notes: ""
};

export default function MedicationsPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["medications"], queryFn: listMedications });
  const [form, setForm] = useState<MedicationEntry>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const activeMeds = useMemo(
    () => data.filter((entry) => entry.status === "active"),
    [data]
  );

  function getDaysOnMed(entry: MedicationEntry) {
    if (!entry.start_date) return null;
    const end = entry.stop_date ?? entry.end_date ?? new Date().toISOString().slice(0, 10);
    const days = differenceInCalendarDays(new Date(end), new Date(entry.start_date));
    return days >= 0 ? days + 1 : null;
  }

  const createMutation = useMutation({
    mutationFn: createMedication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["medications"] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MedicationEntry> }) =>
      updateMedication(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["medications"] })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["medications"] })
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

  function handleEdit(entry: MedicationEntry) {
    setEditingId(entry.id ?? null);
    setForm({
      entry_date: entry.entry_date,
      prescribed_by: entry.prescribed_by ?? "",
      name: entry.name,
      dose: entry.dose,
      dose_unit: entry.dose_unit,
      dose_count: entry.dose_count ?? null,
      frequency: entry.frequency ?? "",
      start_date: entry.start_date,
      end_date: entry.end_date ?? null,
      stop_date: entry.stop_date ?? null,
      status: entry.status,
      notes: entry.notes ?? ""
    });
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = MedicationSchema.parse({
      ...form,
      entry_date: form.entry_date || form.start_date
    });
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
        <PageHeader title="Medications" subtitle="Log your ongoing medication plan." />
        <Button type="button" onClick={openNew}>
          Add Medication
        </Button>
      </div>
      <Card title="Active Medications" subtitle="Currently active">
        {activeMeds.length === 0 ? (
          <p className="text-sm text-slate-500">No active meds.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeMeds.map((entry) => {
              const days = getDaysOnMed(entry);
              return (
                <div key={entry.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">{entry.name}</p>
                      <p className="text-xs text-slate-500">
                        {entry.prescribed_by ?? "Prescriber unknown"}
                      </p>
                    </div>
                    <Badge tone="success">Active</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600">
                    <div>
                      <span className="text-slate-400">Dose:</span>{" "}
                      {entry.dose !== null && entry.dose !== undefined
                        ? `${formatNumber(entry.dose)} ${entry.dose_unit ?? ""}`
                        : "—"}
                      {entry.dose_count && entry.dose_count > 1 ? ` x${entry.dose_count}` : ""}
                    </div>
                    <div>
                      <span className="text-slate-400">Frequency:</span>{" "}
                      {entry.frequency || "—"}
                    </div>
                    <div>
                      <span className="text-slate-400">Start:</span>{" "}
                      {entry.start_date ? formatDate(entry.start_date) : "—"}
                    </div>
                    <div>
                      <span className="text-slate-400">Days on med:</span>{" "}
                      {days !== null ? `${days} days` : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Medication List" subtitle="Active and historical medications">
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2">Medication</th>
                <th className="py-2">Doctor</th>
                <th className="py-2">Potency</th>
                <th className="py-2">Dose</th>
                <th className="py-2">Schedule</th>
                <th className="py-2">Start</th>
                <th className="py-2">Stop</th>
                <th className="py-2">Days</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium">{entry.name}</td>
                  <td className="py-3">{entry.prescribed_by ?? "—"}</td>
                  <td className="py-3">
                    {entry.dose !== null && entry.dose !== undefined
                      ? `${formatNumber(entry.dose)} ${entry.dose_unit ?? ""}`
                      : "—"}
                  </td>
                  <td className="py-3">{entry.dose_count && entry.dose_count > 1 ? `x${entry.dose_count}` : "—"}</td>
                  <td className="py-3">{entry.frequency || "—"}</td>
                  <td className="py-3 text-slate-500">{formatDate(entry.start_date)}</td>
                  <td className="py-3 text-slate-500">
                    {entry.stop_date || entry.end_date ? formatDate(entry.stop_date ?? entry.end_date ?? "") : "—"}
                  </td>
                  <td className="py-3 text-slate-500">{getDaysOnMed(entry) ?? "—"}</td>
                  <td className="py-3">
                    <Badge tone={entry.status === "active" ? "success" : "neutral"}>{entry.status}</Badge>
                  </td>
                  <td className="py-3 flex gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-[96vw] max-w-[900px] rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">
                {editingId ? "Edit Medication" : "Add Medication"}
              </h3>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-4">
              <Input
                value={form.prescribed_by ?? ""}
                onChange={(event) => setForm({ ...form, prescribed_by: event.target.value })}
                placeholder="Prescribing doctor"
              />
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Medication name"
                required
              />
              <Input
                type="number"
                step="0.1"
                value={form.dose ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    dose: event.target.value === "" ? null : Number(event.target.value)
                  })
                }
                placeholder="Potency"
              />
              <Input
                value={form.dose_unit ?? ""}
                onChange={(event) => setForm({ ...form, dose_unit: event.target.value })}
                placeholder="Unit (mg)"
              />
              <Input
                type="number"
                step="1"
                value={form.dose_count ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    dose_count: event.target.value === "" ? null : Number(event.target.value)
                  })
                }
                placeholder="Dose count (e.g. x2)"
              />
              <Input
                value={form.frequency}
                onChange={(event) => setForm({ ...form, frequency: event.target.value })}
                placeholder="Frequency (e.g. 2x/day)"
              />
              <Input
                type="date"
                value={toDateInput(form.start_date)}
                onChange={(event) =>
                  setForm({
                    ...form,
                    start_date: event.target.value,
                    entry_date: event.target.value
                  })
                }
                required
              />
              <Input
                type="date"
                value={toDateInput(form.stop_date)}
                onChange={(event) => setForm({ ...form, stop_date: event.target.value || null })}
                placeholder="Stop date"
              />
              <Select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as MedicationEntry["status"] })
                }
              >
                {MED_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <div className="md:col-span-4">
                <Textarea
                  rows={2}
                  value={form.notes ?? ""}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Notes"
                />
              </div>
              <div className="flex gap-2 md:col-span-4">
                <Button type="submit">{editingId ? "Save Changes" : "Add Medication"}</Button>
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
