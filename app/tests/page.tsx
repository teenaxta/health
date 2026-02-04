"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listLabTests, createLabTest, updateLabTest, deleteLabTest } from "@/lib/api/labTests";
import { LabTestEntry, LabTestSchema } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import LabTestChart from "@/components/charts/LabTestChart";
import { formatDate, formatNumber, toDateInput } from "@/lib/utils";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { Badge } from "@/components/ui/Badge";

const EMPTY_FORM: LabTestEntry = {
  entry_date: "",
  test_name: "",
  value: null,
  unit: "",
  result_text: "",
  lab_name: "",
  problematic: "",
  category: "lab",
  reference_notes: "",
  ref_low: null,
  ref_high: null,
  notes: ""
};

export default function TestsPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["lab_tests"], queryFn: listLabTests });
  const [form, setForm] = useState<LabTestEntry>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [testQuery, setTestQuery] = useState<string>("");
  const [testDropdownOpen, setTestDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [range, setRange] = useState<{ start?: string; end?: string }>({});
  const [sortKey, setSortKey] = useState<"date" | "test" | "problematic">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const testNames = useMemo(
    () => Array.from(new Set(data.map((entry) => entry.test_name))),
    [data]
  );

  useEffect(() => {
    if (!selectedTest && testNames.length > 0) {
      setSelectedTest(testNames[0]);
      setTestQuery(testNames[0]);
    }
  }, [selectedTest, testNames]);

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
      value: entry.value ?? null,
      unit: entry.unit ?? "",
      result_text: entry.result_text ?? "",
      lab_name: entry.lab_name ?? "",
      problematic: entry.problematic ?? "",
      category: entry.category ?? "lab",
      reference_notes: entry.reference_notes ?? "",
      ref_low: entry.ref_low ?? null,
      ref_high: entry.ref_high ?? null,
      notes: entry.notes ?? ""
    });
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = LabTestSchema.parse(form);
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, payload: parsed });
    } else {
      await createMutation.mutateAsync(parsed);
    }
    resetForm();
  }

  function getRowClass(entry: LabTestEntry) {
    const value = (entry.problematic ?? "").toLowerCase().trim();
    if (value.includes("yes")) return "bg-amber-100";
    if (value.includes("slight")) return "bg-amber-50";
    return "";
  }

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const base = query
      ? data.filter((entry) => entry.test_name.toLowerCase().includes(query))
      : data;
    const priority = (value: string) => {
      const normalized = value.toLowerCase().trim();
      if (normalized === "yes") return 2;
      if (normalized === "slight") return 1;
      return 0;
    };
    return [...base].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") {
        cmp = a.entry_date.localeCompare(b.entry_date);
      } else if (sortKey === "test") {
        cmp = a.test_name.localeCompare(b.test_name);
      } else {
        cmp = priority(a.problematic ?? "") - priority(b.problematic ?? "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, searchTerm, sortKey, sortDir]);

  function toggleSort(key: "date" | "test" | "problematic") {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "problematic" ? "desc" : "asc");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title="Lab Tests" subtitle="Track lab values with reference ranges." />
        <Button type="button" onClick={openNew}>
          Add Test
        </Button>
      </div>

      <Card title="Test Trends" subtitle="Choose a test for the chart">
        <div className="mb-4">
          <div className="relative max-w-md">
            <Input
              value={testQuery}
              onFocus={() => setTestDropdownOpen(true)}
              onBlur={() => {
                setTimeout(() => {
                  setTestDropdownOpen(false);
                  if (testNames.includes(testQuery)) {
                    setSelectedTest(testQuery);
                  }
                }, 150);
              }}
              onChange={(event) => {
                setTestQuery(event.target.value);
                setTestDropdownOpen(true);
              }}
              placeholder="Search test name"
            />
            {testDropdownOpen && (
              <div className="absolute z-10 mt-2 max-h-48 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
                {testNames
                  .filter((name) =>
                    name.toLowerCase().includes(testQuery.toLowerCase().trim())
                  )
                  .map((name) => (
                    <button
                      key={name}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSelectedTest(name);
                        setTestQuery(name);
                        setTestDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      {name}
                    </button>
                  ))}
                {testNames.filter((name) =>
                  name.toLowerCase().includes(testQuery.toLowerCase().trim())
                ).length === 0 && (
                  <div className="px-4 py-2 text-sm text-slate-500">No matches</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <DateRangeFilter start={range.start} end={range.end} onChange={setRange} />
        </div>
        {selectedTest ? (
          <LabTestChart data={data} testName={selectedTest} dateRange={range} />
        ) : (
          <p className="text-sm text-slate-500">Choose a test to see a trend.</p>
        )}
      </Card>

      <Card title="History" subtitle="Recent lab tests">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search tests..."
            className="max-w-sm"
          />
          <div className="flex gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Slight</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">Yes</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm table-auto tabular-nums">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2 whitespace-nowrap">
                  <button type="button" onClick={() => toggleSort("date")} className="inline-flex items-center gap-1">
                    Date {sortKey === "date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                  </button>
                </th>
                <th className="px-3 py-2">
                  <button type="button" onClick={() => toggleSort("test")} className="inline-flex items-center gap-1">
                    Test {sortKey === "test" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                  </button>
                </th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Value</th>
                <th className="px-3 py-2 whitespace-nowrap">Type</th>
                <th className="px-3 py-2 whitespace-nowrap">Unit</th>
                <th className="px-3 py-2">Result Text</th>
                <th className="px-3 py-2 whitespace-nowrap">Lab</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Ref Low</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Ref High</th>
                <th className="px-3 py-2">Interpretation</th>
                <th className="px-3 py-2 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort("problematic")}
                    className="inline-flex items-center gap-1"
                  >
                    Problematic{" "}
                    {sortKey === "problematic" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                  </button>
                </th>
                <th className="px-3 py-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => {
                const resultType = typeof entry.value === "number" ? "numeric" : "text";
                const problematic = (entry.problematic ?? "").trim();
                return (
                <tr
                  key={entry.id}
                  className={`border-t border-slate-100 ${getRowClass(entry)}`}
                >
                  <td className="px-3 py-3 whitespace-nowrap">{formatDate(entry.entry_date)}</td>
                  <td className="px-3 py-3 font-medium">{entry.test_name}</td>
                  <td className="px-3 py-3 text-right">{typeof entry.value === "number" ? formatNumber(entry.value) : "—"}</td>
                  <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{resultType}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{entry.unit ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-500 whitespace-pre-wrap">
                    {entry.result_text ?? "—"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">{entry.lab_name ?? "—"}</td>
                  <td className="px-3 py-3 text-right">{entry.ref_low !== null && entry.ref_low !== undefined ? formatNumber(entry.ref_low) : "—"}</td>
                  <td className="px-3 py-3 text-right">{entry.ref_high !== null && entry.ref_high !== undefined ? formatNumber(entry.ref_high) : "—"}</td>
                  <td className="px-3 py-3 text-slate-500 whitespace-pre-wrap">
                    {entry.reference_notes ?? entry.notes ?? "—"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {problematic ? (
                      <Badge tone={problematic.toLowerCase().includes("yes") ? "warning" : problematic.toLowerCase().includes("slight") ? "warning" : "neutral"}>
                        {problematic}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-3 flex gap-2">
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
              );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-[96vw] max-w-[960px] overflow-hidden rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">
                {editingId ? "Edit Lab Test" : "Add Lab Test"}
              </h3>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-4">
              <Input
                type="date"
                value={toDateInput(form.entry_date)}
                onChange={(event) => setForm({ ...form, entry_date: event.target.value })}
                required
              />
              <Input
                value={form.test_name}
                onChange={(event) => setForm({ ...form, test_name: event.target.value })}
                placeholder="Test name (e.g. HbA1c)"
                required
              />
              <Input
                type="number"
                step="0.1"
                value={form.value ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    value: event.target.value === "" ? null : Number(event.target.value)
                  })
                }
                placeholder="Value (numeric)"
              />
              <Input
                value={form.unit}
                onChange={(event) => setForm({ ...form, unit: event.target.value })}
                placeholder="Unit"
              />
              <Input
                value={form.result_text ?? ""}
                onChange={(event) => setForm({ ...form, result_text: event.target.value })}
                placeholder="Result text (if non-numeric)"
              />
              <Input
                value={form.lab_name ?? ""}
                onChange={(event) => setForm({ ...form, lab_name: event.target.value })}
                placeholder="Lab name"
              />
              <Select
                value={form.problematic ?? ""}
                onChange={(event) => setForm({ ...form, problematic: event.target.value })}
              >
                <option value="">Problematic?</option>
                <option value="No">No</option>
                <option value="Slight">Slight</option>
                <option value="Yes">Yes</option>
              </Select>
              <Input
                type="number"
                step="0.1"
                value={form.ref_low ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    ref_low: event.target.value === "" ? null : Number(event.target.value)
                  })
                }
                placeholder="Ref low"
              />
              <Input
                type="number"
                step="0.1"
                value={form.ref_high ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    ref_high: event.target.value === "" ? null : Number(event.target.value)
                  })
                }
                placeholder="Ref high"
              />
              <div className="md:col-span-4">
                <Textarea
                  rows={2}
                  value={form.reference_notes ?? ""}
                  onChange={(event) => setForm({ ...form, reference_notes: event.target.value })}
                  placeholder="Interpretation / Reference notes"
                />
              </div>
              <div className="md:col-span-4">
                <Textarea
                  rows={2}
                  value={form.notes ?? ""}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Additional notes"
                />
              </div>
              <div className="flex gap-2 md:col-span-4">
                <Button type="submit">{editingId ? "Save Changes" : "Add Test"}</Button>
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
