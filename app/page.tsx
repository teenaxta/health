"use client";

import { useQuery } from "@tanstack/react-query";
import { listWeights } from "@/lib/api/weights";
import { listLabTests } from "@/lib/api/labTests";
import { listMedications } from "@/lib/api/medications";
import { listDiagnoses } from "@/lib/api/diagnoses";
import { listSymptoms } from "@/lib/api/symptoms";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { TrendBadge } from "@/components/ui/TrendBadge";
import WeightChart from "@/components/charts/WeightChart";
import LabTestChart from "@/components/charts/LabTestChart";
import { formatDate, formatNumber } from "@/lib/utils";
import { Select } from "@/components/ui/Select";
import { useEffect, useMemo, useState } from "react";

function getLatestDate<T extends { entry_date?: string } | { start_date?: string }>(
  rows: T[],
  key: "entry_date" | "start_date"
) {
  const getValue = (row: T) =>
    (row as Record<string, string | undefined>)[key] ?? "";
  const sorted = [...rows].sort((a, b) =>
    getValue(b).localeCompare(getValue(a))
  );
  return getValue(sorted[0]);
}

export default function DashboardPage() {
  const weightsQuery = useQuery({ queryKey: ["weights"], queryFn: listWeights });
  const testsQuery = useQuery({ queryKey: ["lab_tests"], queryFn: listLabTests });
  const medsQuery = useQuery({ queryKey: ["medications"], queryFn: listMedications });
  const dxQuery = useQuery({ queryKey: ["diagnoses"], queryFn: listDiagnoses });
  const symptomsQuery = useQuery({ queryKey: ["symptoms"], queryFn: listSymptoms });

  const weights = weightsQuery.data ?? [];
  const tests = testsQuery.data ?? [];
  const meds = medsQuery.data ?? [];
  const dx = dxQuery.data ?? [];
  const symptoms = symptomsQuery.data ?? [];

  const weightEntries = weights.filter(
    (entry) => typeof entry.value === "number" && !Number.isNaN(entry.value)
  );
  const latestWeight = weightEntries[0];
  const previousWeight = weightEntries[1];
  const latestValue = latestWeight?.value;
  const previousValue = previousWeight?.value;
  const weightDelta =
    typeof latestValue === "number" && typeof previousValue === "number"
      ? latestValue - previousValue
      : 0;

  const latestTestsDate = getLatestDate(tests, "entry_date");
  const latestMedDate = getLatestDate(meds, "entry_date");

  const testNames = useMemo(
    () => Array.from(new Set(tests.map((test) => test.test_name))),
    [tests]
  );
  const [featuredTest, setFeaturedTest] = useState<string>("");

  useEffect(() => {
    if (!featuredTest && testNames.length > 0) {
      setFeaturedTest(testNames[0]);
    }
  }, [featuredTest, testNames]);

  const latestSymptom = symptoms[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Track your most important health signals at a glance."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Latest Weight"
          value={
            latestWeight ? `${formatNumber(latestWeight.value)} ${latestWeight.unit}` : "—"
          }
          helper={latestWeight ? `Logged ${formatDate(latestWeight.entry_date)}` : "No entries"}
        />
        <StatCard
          label="Active Meds"
          value={`${meds.filter((med) => med.status === "active").length}`}
          helper={latestMedDate ? `Updated ${formatDate(latestMedDate)}` : "No medications"}
        />
        <StatCard
          label="Lab Tests"
          value={`${tests.length}`}
          helper={latestTestsDate ? `Latest ${formatDate(latestTestsDate)}` : "No tests"}
        />
        <StatCard
          label="Latest Symptom"
          value={latestSymptom ? "Logged" : "—"}
          helper={latestSymptom ? formatDate(latestSymptom.entry_date) : "No check-ins"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card
          title="Weight Trend"
          subtitle="Meal-based weight trends"
          actions={latestWeight && previousWeight ? <TrendBadge label="Change" delta={weightDelta} /> : null}
        >
          <WeightChart data={weights} />
        </Card>

        <Card
          title="Featured Lab Test"
          subtitle={featuredTest || "Choose a lab test"}
          actions={
            <Select
              value={featuredTest}
              onChange={(event) => setFeaturedTest(event.target.value)}
            >
              <option value="">Select test</option>
              {testNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          }
        >
          {featuredTest ? (
            <LabTestChart data={tests} testName={featuredTest} />
          ) : (
            <p className="text-sm text-slate-500">Choose a test to see a chart.</p>
          )}
        </Card>
      </div>

      <Card title="Highlights" subtitle="Quick notes on your health log">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Diagnoses</p>
            <p className="text-lg font-semibold text-ink">{dx.length}</p>
            <p className="text-xs text-slate-500">Active and resolved conditions.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Procedures</p>
            <p className="text-lg font-semibold text-ink">
              {tests.filter(
                (test) =>
                  test.category === "procedure" ||
                  /mri|endoscopy|colonoscopy/i.test(test.test_name)
              ).length}
            </p>
            <p className="text-xs text-slate-500">Imaging and procedures logged.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Consistency</p>
            <p className="text-lg font-semibold text-ink">{weights.length}</p>
            <p className="text-xs text-slate-500">Total weigh-ins logged.</p>
          </div>
        </div>
      </Card>

      <Card title="Current Feelings" subtitle="Latest check-in">
        {latestSymptom ? (
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-ink">{latestSymptom.feelings}</p>
            {latestSymptom.symptoms && <p>Symptoms: {latestSymptom.symptoms}</p>}
            {latestSymptom.notes && <p>Notes: {latestSymptom.notes}</p>}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No symptoms logged yet.</p>
        )}
      </Card>
    </div>
  );
}
