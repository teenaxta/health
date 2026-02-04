"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CSV_TYPES, CsvType } from "@/lib/constants";
import { parseCsv, exportCsv } from "@/lib/csv";
import { supabase, assertSupabaseConfigured } from "@/lib/supabase";
import { listWeights } from "@/lib/api/weights";
import { listLabTests } from "@/lib/api/labTests";
import { listMedications } from "@/lib/api/medications";
import { listDiagnoses } from "@/lib/api/diagnoses";
import { listSymptoms } from "@/lib/api/symptoms";

export default function ImportExportPage() {
  const [type, setType] = useState<CsvType>("weights");
  const [status, setStatus] = useState<string>("");

  const queries = {
    weights: useQuery({ queryKey: ["weights"], queryFn: listWeights }),
    lab_tests: useQuery({ queryKey: ["lab_tests"], queryFn: listLabTests }),
    medications: useQuery({ queryKey: ["medications"], queryFn: listMedications }),
    diagnoses: useQuery({ queryKey: ["diagnoses"], queryFn: listDiagnoses }),
    symptoms: useQuery({ queryKey: ["symptoms"], queryFn: listSymptoms })
  };

  const currentData = queries[type].data ?? [];

  async function handleExport() {
    const sanitized = (currentData as Array<Record<string, unknown>>).map((row) => {
      const { id, created_at, updated_at, ...rest } = row;
      return rest;
    });
    exportCsv(sanitized, `${type}.csv`);
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Parsing CSV...");
    try {
      assertSupabaseConfigured();
      const rows = await parseCsv(file, type);
      const { error } = await supabase.from(type).insert(rows as Array<Record<string, unknown>>);
      if (error) throw error;
      setStatus(`Imported ${rows.length} rows into ${type}.`);
    } catch (error) {
      console.error(error);
      setStatus("Import failed. Check console for details.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Import / Export" subtitle="Bring in CSV data or download your log." />

      <Card title="Choose Data Type" subtitle="Use the same fields as the app forms">
        <div className="grid gap-4 md:grid-cols-3">
          <Select value={type} onChange={(event) => setType(event.target.value as CsvType)}>
            {CSV_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Button type="button" onClick={handleExport}>
            Export CSV
          </Button>
          <Input type="file" accept=".csv" onChange={handleImport} />
        </div>
        {status && <p className="mt-3 text-sm text-slate-500">{status}</p>}
      </Card>

      <Card title="CSV Field Guide">
        <div className="text-sm text-slate-600 space-y-2">
          <p>Weights: entry_date, meal, value, unit, calories, fat, protein, symptoms, notes</p>
          <p>
            Lab Tests (accepted headers):
            <br />
            Date, Test name (e.g. HbA1c), Value (numeric), Result type, Unit, Result text (if non-numeric), Lab name, Ref low, Ref high, Interpretation / Reference notes, Problematic
          </p>
          <p>
            Procedures (upload as Lab Tests):
            <br />
            Date, Procedure, Findings, Lab, Interpretation
          </p>
          <p>Medications: entry_date, prescribed_by, name, dose, dose_unit, dose_count, frequency, start_date, stop_date, status, notes</p>
          <p>Diagnoses: entry_date, name, diagnosis_date, status, provider, notes</p>
          <p>Symptoms: entry_date, feelings, symptoms, notes</p>
        </div>
      </Card>
    </div>
  );
}
