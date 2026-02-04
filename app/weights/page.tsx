"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listWeights, createWeight, updateWeight, deleteWeight } from "@/lib/api/weights";
import { WeightEntry, WeightSchema } from "@/lib/types";
import { MEAL_OPTIONS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import WeightChart from "@/components/charts/WeightChart";
import { formatDate, formatNumber, toDateInput } from "@/lib/utils";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { parseCsv, exportCsv } from "@/lib/csv";
import { supabase, assertSupabaseConfigured } from "@/lib/supabase";

type DaySummary = {
  date: string;
  avgWeight: number | null;
  calories: number;
  fat: number;
  protein: number;
  symptoms: string;
  entries: WeightEntry[];
};

type WeightFormEntry = Omit<
  WeightEntry,
  "value" | "calories" | "fat" | "protein"
> & {
  value: number | null;
  calories: number | null;
  fat: number | null;
  protein: number | null;
};

const EMPTY_ENTRY: WeightFormEntry = {
  entry_date: "",
  meal: "breakfast",
  value: null,
  unit: "kg",
  calories: null,
  fat: null,
  protein: null,
  menu: "",
  symptoms: "",
  notes: "",
  source: ""
};

export default function WeightPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["weights"], queryFn: listWeights });
  const [range, setRange] = useState<{ start?: string; end?: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [modalEntries, setModalEntries] = useState<WeightFormEntry[]>([]);
  const [originalIds, setOriginalIds] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState("");

  const createMutation = useMutation({
    mutationFn: createWeight,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weights"] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WeightEntry> }) =>
      updateWeight(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weights"] })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWeight,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weights"] })
  });

  const summaries = useMemo(() => {
    const map = new Map<string, WeightEntry[]>();
    data.forEach((entry) => {
      if (!map.has(entry.entry_date)) {
        map.set(entry.entry_date, []);
      }
      map.get(entry.entry_date)!.push(entry);
    });

    return Array.from(map.entries())
      .map(([date, entries]) => {
        const weights = entries
          .map((entry) => entry.value)
          .filter((value): value is number => typeof value === "number" && !Number.isNaN(value));
        const avgWeight = weights.length
          ? weights.reduce((sum, val) => sum + val, 0) / weights.length
          : null;
        const calories = entries.reduce((sum, entry) => sum + (entry.calories ?? 0), 0);
        const fat = entries.reduce((sum, entry) => sum + (entry.fat ?? 0), 0);
        const protein = entries.reduce((sum, entry) => sum + (entry.protein ?? 0), 0);
        const symptoms = Array.from(
          new Set(entries.map((entry) => entry.symptoms).filter(Boolean) as string[])
        ).join("; ");
        return {
          date,
          avgWeight,
          calories,
          fat,
          protein,
          symptoms,
          entries
        } as DaySummary;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data]);

  const filteredSummaries = useMemo(() => {
    return summaries.filter((summary) => {
      if (range.start && summary.date < range.start) return false;
      if (range.end && summary.date > range.end) return false;
      return true;
    });
  }, [summaries, range]);

  const weightChange = useMemo(() => {
    const withWeights = filteredSummaries.filter(
      (summary): summary is DaySummary & { avgWeight: number } =>
        typeof summary.avgWeight === "number"
    );
    if (withWeights.length < 2) {
      return { kg: 0, percent: 0 };
    }
    const sorted = [...withWeights].sort((a, b) => a.date.localeCompare(b.date));
    const start = sorted[0].avgWeight;
    const end = sorted[sorted.length - 1].avgWeight;
    const kg = end - start;
    const percent = start ? (kg / start) * 100 : 0;
    return { kg, percent };
  }, [filteredSummaries]);

  function openNewDay() {
    const today = new Date().toISOString().slice(0, 10);
    setModalDate(today);
    setModalEntries([{ ...EMPTY_ENTRY, entry_date: today, meal: "breakfast" }]);
    setOriginalIds([]);
    setModalOpen(true);
  }

  function openDay(summary: DaySummary) {
    setModalDate(summary.date);
    const existing = summary.entries.map((entry) => ({
      ...entry,
      value: entry.value ?? null,
      calories: entry.calories ?? null,
      fat: entry.fat ?? null,
      protein: entry.protein ?? null
    }));
    const ordered = [...existing].sort(
      (a, b) => MEAL_OPTIONS.indexOf(a.meal) - MEAL_OPTIONS.indexOf(b.meal)
    );
    setModalEntries(ordered);
    setOriginalIds(summary.entries.map((entry) => entry.id!).filter(Boolean));
    setModalOpen(true);
  }

  function updateEntry(index: number, patch: Partial<WeightFormEntry>) {
    setModalEntries((prev) =>
      prev.map((entry, idx) => (idx === index ? { ...entry, ...patch } : entry))
    );
  }

  function addMeal() {
    setModalEntries((prev) => [
      ...prev,
      { ...EMPTY_ENTRY, entry_date: modalDate || new Date().toISOString().slice(0, 10), meal: "other" }
    ]);
  }

  function removeMeal(index: number) {
    setModalEntries((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function saveDay() {
    try {
      if (!modalDate) {
        alert("Please select a date.");
        return;
      }
      const normalized = modalEntries
        .map((entry, index) => ({
          ...entry,
          entry_date: modalDate,
          unit: entry.unit || "kg",
          _index: index
        }))
        .filter((entry) => {
          const hasWeight = typeof entry.value === "number" && entry.value > 0;
          const hasNutrition =
            typeof entry.calories === "number" ||
            typeof entry.fat === "number" ||
            typeof entry.protein === "number";
          const hasText =
            (entry.menu ?? "").trim().length > 0 || (entry.symptoms ?? "").trim().length > 0;
          return hasWeight || hasNutrition || hasText;
        });

      if (normalized.length === 0) {
        alert("Add at least one meal entry before saving.");
        return;
      }

      const parsed: WeightEntry[] = [];
      for (const entry of normalized) {
        const { _index, ...payload } = entry as WeightFormEntry & { _index: number };
        const result = WeightSchema.safeParse(payload);
        if (!result.success) {
          console.error(result.error);
          const issue = result.error.issues[0]?.message ?? "Check the inputs.";
          alert(`Row ${_index + 1} has invalid data. ${issue}`);
          return;
        }
        parsed.push(result.data);
      }
      const currentIds = parsed.map((entry) => entry.id).filter(Boolean) as string[];
      const deleteIds = originalIds.filter((id) => !currentIds.includes(id));

      await Promise.all(deleteIds.map((id) => deleteMutation.mutateAsync(id)));

      for (const entry of parsed) {
        if (entry.id) {
          await updateMutation.mutateAsync({ id: entry.id, payload: entry });
        } else {
          await createMutation.mutateAsync(entry);
        }
      }

      setModalOpen(false);
    } catch (error) {
      console.error(error);
      const message =
        (error as { message?: string; details?: string })?.message ||
        (error as { details?: string })?.details ||
        "Failed to save. Check console for details.";
      if (typeof message === "string" && message.toLowerCase().includes("column")) {
        alert(
          "Save failed because your Supabase table is missing new columns (calories/fat/protein). Run the weights migration first."
        );
      } else {
        alert(message);
      }
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportStatus("Parsing CSV...");
    try {
      assertSupabaseConfigured();
      const rows = await parseCsv<WeightEntry>(file, "weights");
      const { error } = await supabase.from("weights").insert(rows as Array<Record<string, unknown>>);
      if (error) throw error;
      setImportStatus(`Imported ${rows.length} rows.`);
      queryClient.invalidateQueries({ queryKey: ["weights"] });
    } catch (error) {
      console.error(error);
      setImportStatus("Import failed. Check console for details.");
    }
  }

  function downloadTemplate() {
    exportCsv(
      [
        {
          entry_date: "2025-09-01",
          meal: "breakfast",
          value: 80,
          unit: "kg",
          calories: 450,
          fat: 12,
          protein: 25,
          symptoms: "Nausea",
          notes: ""
        }
      ],
      "weights_template.csv"
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title="Weight" subtitle="Daily averages with meal-level detail." />
        <Button type="button" onClick={openNewDay}>
          Add Day
        </Button>
      </div>

      <Card title="Weight Trend" subtitle="Daily average weight">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <DateRangeFilter start={range.start} end={range.end} onChange={setRange} />
          <div className="text-sm text-slate-600">
            Change: {formatNumber(weightChange.kg)} kg ({formatNumber(weightChange.percent)}%)
          </div>
        </div>
        <WeightChart data={data} dateRange={range} />
      </Card>

      <Card title="Daily Summary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed tabular-nums">
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "42%" }} />
            </colgroup>
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2 whitespace-nowrap">Date</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Avg (kg)</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Calories</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Fat</th>
                <th className="px-3 py-2 text-right whitespace-nowrap">Protein</th>
                <th className="px-3 py-2 whitespace-nowrap">Symptoms</th>
              </tr>
            </thead>
            <tbody>
              {filteredSummaries.map((summary) => (
                <tr
                  key={summary.date}
                  className="border-t border-slate-100 cursor-pointer hover:bg-slate-50 align-top"
                  onClick={() => openDay(summary)}
                >
                  <td className="px-3 py-4 whitespace-nowrap">{formatDate(summary.date)}</td>
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    {typeof summary.avgWeight === "number"
                      ? `${formatNumber(summary.avgWeight)} kg`
                      : "—"}
                  </td>
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    {summary.calories ? formatNumber(summary.calories) : "—"}
                  </td>
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    {summary.fat ? formatNumber(summary.fat) : "—"}
                  </td>
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    {summary.protein ? formatNumber(summary.protein) : "—"}
                  </td>
                  <td className="px-3 py-4 text-slate-500 whitespace-pre-wrap leading-relaxed">
                    {summary.symptoms || "—"}
                  </td>
                </tr>
              ))}
              {filteredSummaries.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
                    No entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Import / Export" subtitle="Upload weights or download a template">
        <div className="flex flex-wrap gap-3 items-center">
          <Button type="button" variant="soft" onClick={downloadTemplate}>
            Download Template
          </Button>
          <Input type="file" accept=".csv" onChange={handleImport} />
          {importStatus && <span className="text-sm text-slate-500">{importStatus}</span>}
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-[96vw] max-w-[1440px] overflow-hidden rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Meal Breakdown</h3>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <div className="mt-4 grid gap-3">
              <Input
                type="date"
                value={toDateInput(modalDate)}
                onChange={(event) => setModalDate(event.target.value)}
                className="max-w-[240px]"
              />
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="min-w-[1100px] w-full text-sm table-fixed">
                  <colgroup>
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "26%" }} />
                    <col style={{ width: "6%" }} />
                  </colgroup>
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="p-3 text-left">Meal</th>
                      <th className="p-3 text-left">What Was Eaten</th>
                      <th className="p-3 text-left">Weight</th>
                      <th className="p-3 text-left">Calories</th>
                      <th className="p-3 text-left">Fat</th>
                      <th className="p-3 text-left">Protein</th>
                      <th className="p-3 text-left">Symptoms</th>
                      <th className="p-3 text-left sticky right-0 bg-slate-50">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalEntries.map((entry, idx) => (
                      <tr key={entry.id ?? idx} className="border-t border-slate-100 align-top">
                        <td className="p-3">
                          <Select
                            value={entry.meal}
                            onChange={(event) =>
                              updateEntry(idx, { meal: event.target.value as WeightEntry["meal"] })
                            }
                            className="w-full rounded-xl py-2 text-sm"
                          >
                            {MEAL_OPTIONS.map((meal) => (
                              <option key={meal} value={meal}>
                                {meal}
                              </option>
                            ))}
                          </Select>
                        </td>
                        <td className="p-3">
                          <Textarea
                            rows={2}
                            value={entry.menu ?? ""}
                            onChange={(event) => updateEntry(idx, { menu: event.target.value })}
                            placeholder="Meal / Menu"
                            className="w-full rounded-xl text-sm min-h-[72px]"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="0.1"
                            value={entry.value ?? ""}
                            onChange={(event) =>
                              updateEntry(idx, {
                                value: event.target.value === "" ? null : Number(event.target.value)
                              })
                            }
                            placeholder="Weight"
                            className="w-full rounded-xl py-2 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="1"
                            value={entry.calories ?? ""}
                            onChange={(event) =>
                              updateEntry(idx, {
                                calories: event.target.value === "" ? null : Number(event.target.value)
                              })
                            }
                            placeholder="Calories"
                            className="w-full rounded-xl py-2 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="1"
                            value={entry.fat ?? ""}
                            onChange={(event) =>
                              updateEntry(idx, {
                                fat: event.target.value === "" ? null : Number(event.target.value)
                              })
                            }
                            placeholder="Fat"
                            className="w-full rounded-xl py-2 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="1"
                            value={entry.protein ?? ""}
                            onChange={(event) =>
                              updateEntry(idx, {
                                protein: event.target.value === "" ? null : Number(event.target.value)
                              })
                            }
                            placeholder="Protein"
                            className="w-full rounded-xl py-2 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <Textarea
                            rows={2}
                            value={entry.symptoms ?? ""}
                            onChange={(event) => updateEntry(idx, { symptoms: event.target.value })}
                            placeholder="Symptoms after meal"
                            className="w-full rounded-xl text-sm min-h-[72px]"
                          />
                        </td>
                        <td className="p-3 sticky right-0 bg-white">
                          <Button
                            type="button"
                            variant="ghost"
                            className="px-2 py-1 text-xs"
                            onClick={() => removeMeal(idx)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {modalEntries.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-sm text-slate-500">
                          No meals added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="soft" onClick={addMeal}>
                  Add meal
                </Button>
                <Button type="button" onClick={saveDay}>
                  Save day
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
