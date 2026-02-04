import Papa from "papaparse";
import { isValid, parse } from "date-fns";
import { CsvType } from "@/lib/constants";
import {
  DiagnosisSchema,
  LabTestSchema,
  MedicationSchema,
  SymptomSchema,
  WeightSchema
} from "@/lib/types";

const schemaMap = {
  weights: WeightSchema,
  lab_tests: LabTestSchema,
  medications: MedicationSchema,
  diagnoses: DiagnosisSchema,
  symptoms: SymptomSchema
};

export function parseCsv<T = unknown>(file: File, type: CsvType): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const schema = schemaMap[type];
        const parsed = (results.data as T[]).map((row) => {
          const normalized = normalizeRow(row as Record<string, unknown>);
          return schema.parse(normalized) as T;
        });
        resolve(parsed);
      },
      error: (error) => reject(error)
    });
  });
}

export function exportCsv(rows: Array<Record<string, unknown>>, filename: string) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function normalizeRow(row: Record<string, unknown>) {
  const output: Record<string, unknown> = {};
  Object.entries(row).forEach(([key, value]) => {
    if (value === "" || value === undefined) {
      output[key] = null;
      return;
    }
    const numeric = Number(value);
    if (!Number.isNaN(numeric) && value !== "" && value !== null) {
      output[key] = numeric;
    } else {
      output[key] = value;
    }
  });
  function pick(keys: string[]) {
    for (const key of keys) {
      if (key in output) return output[key];
      if (key in row) return row[key as keyof typeof row];
    }
    return undefined;
  }

  function normalizeDate(value: unknown) {
    if (!value) return undefined;
    const raw = String(value).trim();
    if (!raw) return undefined;
    const direct = new Date(raw);
    if (isValid(direct)) return direct.toISOString().slice(0, 10);
    const formats = ["yyyy-MM-dd", "M/d/yy", "MM/dd/yy", "d-MMM-yy", "dd-MMM-yy"];
    for (const fmt of formats) {
      const parsed = parse(raw, fmt, new Date());
      if (isValid(parsed)) return parsed.toISOString().slice(0, 10);
    }
    return raw;
  }

  const dateValue =
    pick(["Date", "Test Date", "date", "test_date"]) ?? output.entry_date ?? output.start_date;
  const normalizedDate = normalizeDate(dateValue);
  if (normalizedDate) output.entry_date = normalizedDate;

  const testName = pick(["Test name (e.g. HbA1c)", "Test Name", "test_name", "Procedure"]);
  if (testName && !output.test_name) output.test_name = testName;

  const labName = pick(["Lab name", "Lab", "lab_name"]);
  if (labName && !output.lab_name) output.lab_name = labName;

  const refNotes = pick([
    "Interpretation / Reference notes",
    "Test Interpretation",
    "Interpretation",
    "reference_notes"
  ]);
  if (refNotes && !output.reference_notes) output.reference_notes = refNotes;

  const problematic = pick(["Problematic", "Problematic (No/Slight/Yes)", "problematic"]);
  if (problematic && !output.problematic) output.problematic = problematic;

  const unit = pick(["Unit", "unit"]);
  if (unit && !output.unit) output.unit = unit;

  const refLow = pick(["Ref low", "ref_low"]);
  if (refLow !== undefined && refLow !== null && refLow !== "") output.ref_low = Number(refLow);

  const refHigh = pick(["Ref high", "ref_high"]);
  if (refHigh !== undefined && refHigh !== null && refHigh !== "") output.ref_high = Number(refHigh);

  const resultType = pick(["Result type", "result_type"]);
  const numericValue = pick(["Value (numeric)", "value"]);
  if (numericValue !== undefined && numericValue !== null && numericValue !== "") {
    output.value = Number(numericValue);
  }
  const resultText = pick(["Result text (if non-numeric)", "result_text", "Test Result", "Findings"]);
  if ((resultType && String(resultType).toLowerCase().includes("text")) || output.value === null || output.value === undefined) {
    if (resultText && !output.result_text) output.result_text = resultText;
  }

  if ((row["Procedure"] || row["Findings"] || row["Interpretation"]) && !output.category) {
    output.category = "procedure";
  }
  if (output["Test Result"] && !output.result_text && !output.value) {
    const raw = String(output["Test Result"]).trim();
    const match = raw.match(/^([0-9]+(?:\\.[0-9]+)?)\\s*([A-Za-z/%]+)?$/);
    if (match) {
      output.value = Number(match[1]);
      output.unit = match[2] ?? output.unit ?? null;
    } else {
      output.result_text = raw;
    }
  }
  if (!output.entry_date) {
    if (output.start_date) {
      output.entry_date = output.start_date;
    } else if (output.diagnosis_date) {
      output.entry_date = output.diagnosis_date;
    }
  }
  if (!output.meal) {
    output.meal = "other";
  }
  return output;
}
